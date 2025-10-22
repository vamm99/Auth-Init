import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Sales, SalesDocument, SalesStatus } from 'src/schemas/sales.schema';
import { UserSales } from 'src/schemas/user_sales.schema';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { Pagination } from 'src/type/pagination';
import { PaginateResult } from 'mongoose';

interface SalesFilterOptions {
  status?: SalesStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

@Injectable()
export class SalesRepository {
  constructor(
    @InjectModel(Sales.name) private salesModel: mongoose.PaginateModel<Sales>,
    @InjectModel(UserSales.name)
    public userSalesModel: mongoose.PaginateModel<UserSales>,
  ) {}

  // Reemplazar el método createSale en sales.repository.ts

async createSale(saleData: CreateSaleDto, userId: string): Promise<SalesDocument> {
  try {
    // Create the sale with the user_id from the DTO
    const sale = new this.salesModel({
      ...saleData,
      user_id: userId,
      status: saleData.status || SalesStatus.PENDING,
    });
    
    const newSale = await sale.save();

    // Create the user-sales relationship
    await this.userSalesModel.create({
      user_id: userId,
      sales_id: newSale._id,
    });
    
    // Populate product details
    return this.getSaleById(newSale._id.toString());
  } catch (error) {
    console.error('Error en createSale repository:', error);
    throw error;
  }
}

// También puedes comentar o eliminar el método startSession ya que no se usará
// async startSession() {
//   return this.salesModel.db.startSession();
// }

  async startSession() {
    return this.salesModel.db.startSession();
  }

  async getSalesByUser(
    userId: string,
    pagination: Pagination,
    filters?: SalesFilterOptions,
  ): Promise<PaginateResult<SalesDocument>> {
    const { page = 1, limit = 10 } = pagination;

    // Build date query
    const dateQuery: any = {};
    if (filters?.startDate || filters?.endDate) {
      dateQuery.createdAt = {};
      if (filters.startDate) {
        dateQuery.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        dateQuery.createdAt.$lte = new Date(filters.endDate);
      }
    }

    // Build status query
    const statusQuery = filters?.status ? { status: filters.status } : {};

    // Build search query
    const searchQuery = filters?.search
      ? {
          $or: [
            { 'products.name': { $regex: filters.search, $options: 'i' } },
            { orderNumber: { $regex: filters.search, $options: 'i' } },
          ],
        }
      : {};

    try {
      // Get user's sales with pagination
      const sales = await this.salesModel.paginate<SalesDocument>(
        { 
          user_id: new mongoose.Types.ObjectId(userId),
          ...dateQuery,
          ...statusQuery,
          ...searchQuery
        },
        {
          page,
          limit,
          populate: [
            {
              path: 'products.product_id',
              select: 'name price image_url',
            },
            {
              path: 'user_id',
              select: 'name email',
            }
          ],
          sort: { createdAt: -1 },
          lean: true,
        },
      );

      // Convert the result to the expected type
      return sales as unknown as PaginateResult<SalesDocument>;
    } catch (error) {
      console.error('Error in getSalesByUser:', error);
      throw error;
    }
  }

  async getSaleById(saleId: string): Promise<SalesDocument> {
    const sale = await this.salesModel
      .findById(saleId)
      .populate({
        path: 'products.product_id',
        select: 'name description price image_url',
      })
      .populate('user_id', 'name email')
      .lean()
      .exec();

    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }

    return sale as SalesDocument;
  }

  async updateSaleStatus(
    saleId: string, 
    status: SalesStatus,
    paymentId?: string
  ): Promise<SalesDocument> {
    const updateData: any = { status };
    if (paymentId) {
      updateData.payment_id = paymentId;
    }

    const updatedSale = await this.salesModel
      .findByIdAndUpdate(
        saleId,
        updateData,
        { new: true, runValidators: true },
      )
      .populate({
        path: 'products.product_id',
        select: 'name price image_url',
      })
      .populate('user_id', 'name email')
      .lean()
      .exec();

    if (!updatedSale) {
      throw new NotFoundException('Venta no encontrada');
    }

    return updatedSale as SalesDocument;
  }

  async getSalesStats(userId?: string) {
    const match: any = {};
    
    if (userId) {
      const userSales = await this.userSalesModel.find({ user_id: userId });
      if (userSales.length > 0) {
        match._id = { $in: userSales.map(us => us.sales_id) };
      } else {
        // Return empty stats if no sales found for user
        return {
          totalSales: 0,
          totalRevenue: 0,
          avgOrderValue: 0,
          statusCounts: {},
        };
      }
    }

    const stats = await this.salesModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' },
          byStatus: { $push: '$status' },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalRevenue: 1,
          avgOrderValue: { $round: ['$avgOrderValue', 2] },
          statusCounts: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: ['$byStatus', []] },
                as: 'status',
                in: {
                  k: '$$status',
                  v: {
                    $size: {
                      $filter: {
                        input: '$byStatus',
                        as: 's',
                        cond: { $eq: ['$$s', '$$status'] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    return stats[0] || {
      totalSales: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      statusCounts: {},
    };
  }

  async getSalesForExport(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const dateQuery: any = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) {
        dateQuery.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Agregar 1 día para incluir todo el día final
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        dateQuery.createdAt.$lte = endDateTime;
      }
    }
  
    const userSales = await this.userSalesModel
      .find({ user_id: userId, ...dateQuery })
      .populate({
        path: 'sales_id',
        populate: {
          path: 'products.product_id',
          select: 'name price image_url',
        },
      })
      .sort({ createdAt: -1 })
      .lean();
  
    return userSales.map(us => {
      const sale = us.sales_id as any;
      return {
        _id: sale._id,
        user_id: sale.user_id,
        orderNumber: sale.orderNumber,
        status: sale.status,
        total: sale.total,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
        products: sale.products.map((p: any) => ({
          product_id: p.product_id?._id || p.product_id,
          name: p.name || p.product_id?.name || 'Producto sin nombre',
          price: p.price || 0,
          quantity: p.quantity || 0,
          image_url: p.image_url || p.product_id?.image_url || '',
        }))
      };
    });
  }
}
