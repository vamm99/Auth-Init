import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Kardex } from 'src/schemas/kardex.schema';
import { ProductKardex } from 'src/schemas/product_kardex.schema';
import { UserProduct } from 'src/schemas/user_product.schema';
import { CreateKardexDto } from '../dto/create-kardex.dto';
import { Pagination } from 'src/type/pagination';

@Injectable()
export class KardexRepository {
  constructor(
    @InjectModel(Kardex.name) private kardexModel: mongoose.Model<Kardex>,
    @InjectModel(ProductKardex.name)
    private productKardexModel: mongoose.Model<ProductKardex>,
    @InjectModel(UserProduct.name)
    private userProductModel: mongoose.Model<UserProduct>,
  ) {}

  async createKardex(kardexData: CreateKardexDto) {
    const newKardex = await this.kardexModel.create({
      comment: kardexData.comment,
      quantity: kardexData.quantity,
      stock: kardexData.stock,
    });

    await this.productKardexModel.create({
      product_id: kardexData.product_id,
      kardex_id: newKardex._id,
    });

    return newKardex;
  }

  async getKardexByProduct(
    product_id: string,
    pagination: Pagination,
    filters?: {
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const { page, limit } = pagination;

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

    const kardexRecords = await this.productKardexModel
      .find({ product_id, ...dateQuery })
      .populate('kardex_id')
      .sort({ createdAt: -1 })
      .skip(((page || 1) - 1) * (limit || 10))
      .limit(limit || 10);

    const total = await this.productKardexModel.countDocuments({
      product_id,
      ...dateQuery,
    });

    return {
      docs: kardexRecords,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / (limit || 1)),
    };
  }

  async getInventoryByUser(user_id: string) {
    // Obtener todos los productos del usuario
    const userProducts = await this.userProductModel
      .find({ user_id })
      .populate({
        path: 'product_id',
        populate: {
          path: 'category_id',
          model: 'Category',
        },
      });

    // Para cada producto, obtener el último movimiento de kardex
    const inventory = await Promise.all(
      userProducts.map(async (up: any) => {
        const lastKardex = await this.productKardexModel
          .findOne({ product_id: up.product_id._id })
          .populate('kardex_id')
          .sort({ createdAt: -1 });

        return {
          product: up.product_id,
          currentStock: lastKardex
            ? (lastKardex as any).kardex_id.stock
            : up.product_id.stock,
          lastMovement: lastKardex ? (lastKardex as any).kardex_id : null,
        };
      }),
    );

    return inventory;
  }

  async getKardexForExport(
    user_id: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    // Obtener productos del usuario
    const userProducts = await this.userProductModel
      .find({ user_id })
      .populate('product_id');

    const productIds = userProducts.map((up: any) => up.product_id._id);

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

    const kardexRecords = await this.productKardexModel
      .find({
        product_id: { $in: productIds },
        ...dateQuery,
      })
      .populate('product_id')
      .populate('kardex_id')
      .sort({ createdAt: -1 });

    return kardexRecords;
  }

  async getInventoryStats(user_id: string) {
    const inventory = await this.getInventoryByUser(user_id);

    const totalProducts = inventory.length;
    const totalStock = inventory.reduce(
      (sum, item) => sum + item.currentStock,
      0,
    );
    const lowStock = inventory.filter((item) => item.currentStock < 10).length;
    const outOfStock = inventory.filter((item) => item.currentStock === 0)
      .length;

    return {
      totalProducts,
      totalStock,
      lowStock,
      outOfStock,
    };
  }
}
