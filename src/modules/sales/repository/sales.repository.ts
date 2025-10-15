import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Sales } from 'src/schemas/sales.schema';
import { UserSales } from 'src/schemas/user_sales.schema';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { Pagination } from 'src/type/pagination';

@Injectable()
export class SalesRepository {
  constructor(
    @InjectModel(Sales.name) private salesModel: mongoose.PaginateModel<Sales>,
    @InjectModel(UserSales.name)
    private userSalesModel: mongoose.PaginateModel<UserSales>,
  ) {}

  async createSale(saleData: CreateSaleDto, user_id: string) {
    const newSale = await this.salesModel.create(saleData);
    await this.userSalesModel.create({
      user_id,
      sales_id: newSale._id,
    });
    return newSale;
  }

  async getSalesByUser(
    user_id: string,
    pagination: Pagination,
    filters?: {
      status?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const { page, limit } = pagination;

    // Construir query para filtrar por fechas
    const dateQuery: any = {};
    if (filters?.startDate || filters?.endDate) {
      dateQuery.createdAt = {};
      if (filters.startDate) {
        dateQuery.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        dateQuery.createdAt.$lte = filters.endDate;
      }
    }

    const sales = await this.userSalesModel.paginate(
      { user_id, ...dateQuery },
      {
        page,
        limit,
        populate: 'sales_id',
        sort: { createdAt: -1 },
      },
    );

    return sales;
  }

  async getSaleById(sale_id: string) {
    const sale = await this.salesModel.findById(sale_id);
    return sale;
  }

  async updateSaleStatus(sale_id: string, status: string) {
    const sale = await this.salesModel.findByIdAndUpdate(
      sale_id,
      { status },
      { new: true },
    );
    return sale;
  }

  async getSalesStats(user_id: string) {
    const allSales = await this.userSalesModel
      .find({ user_id })
      .populate('sales_id');

    const total = allSales.length;
    const pending = allSales.filter(
      (s: any) => s.sales_id?.status === 'pending',
    ).length;
    const completed = allSales.filter(
      (s: any) => s.sales_id?.status === 'completed',
    ).length;

    const totalRevenue = allSales.reduce(
      (sum: number, s: any) => sum + (s.sales_id?.total || 0),
      0,
    );

    return {
      total,
      pending,
      completed,
      totalRevenue,
    };
  }

  async getSalesForExport(
    user_id: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const dateQuery: any = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) {
        dateQuery.createdAt.$gte = startDate;
      }
      if (endDate) {
        dateQuery.createdAt.$lte = endDate;
      }
    }

    const sales = await this.userSalesModel
      .find({ user_id, ...dateQuery })
      .populate('sales_id')
      .sort({ createdAt: -1 });

    return sales;
  }
}
