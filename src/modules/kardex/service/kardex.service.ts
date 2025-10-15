import { Injectable } from '@nestjs/common';
import { KardexRepository } from '../repository/kardex.repository';
import { CreateKardexDto } from '../dto/create-kardex.dto';
import { Pagination } from 'src/type/pagination';
import { ApiResponse } from 'src/type/type';

@Injectable()
export class KardexService {
  constructor(private readonly kardexRepository: KardexRepository) {}

  async createKardex(kardexData: CreateKardexDto) {
    const newKardex = await this.kardexRepository.createKardex(kardexData);
    return {
      code: 201,
      message: 'Kardex entry created successfully',
      data: newKardex,
    };
  }

  async getKardexByProduct(
    product_id: string,
    pagination: Pagination,
    filters?: {
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<ApiResponse<any[]>> {
    const kardex = await this.kardexRepository.getKardexByProduct(
      product_id,
      pagination,
      filters,
    );

    const kardexList = kardex.docs.map((item: any) => ({
      ...item.kardex_id.toObject(),
      _id: item.kardex_id._id,
      product_id: item.product_id,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return {
      code: 200,
      message: 'Kardex fetched successfully',
      data: kardexList,
      meta: {
        page: kardex.page!,
        limit: kardex.limit!,
        total: kardex.total!,
        totalPages: kardex.totalPages!,
      },
    };
  }

  async getInventoryByUser(user_id: string) {
    const inventory = await this.kardexRepository.getInventoryByUser(user_id);
    return {
      code: 200,
      message: 'Inventory fetched successfully',
      data: inventory,
    };
  }

  async getKardexForExport(
    user_id: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const kardex = await this.kardexRepository.getKardexForExport(
      user_id,
      startDate,
      endDate,
    );

    const kardexList = kardex.map((item: any) => ({
      product: item.product_id,
      kardex: item.kardex_id,
      createdAt: item.createdAt,
    }));

    return {
      code: 200,
      message: 'Kardex for export fetched successfully',
      data: kardexList,
    };
  }

  async getInventoryStats(user_id: string) {
    const stats = await this.kardexRepository.getInventoryStats(user_id);
    return {
      code: 200,
      message: 'Inventory stats fetched successfully',
      data: stats,
    };
  }
}
