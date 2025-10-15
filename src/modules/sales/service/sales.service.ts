import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../repository/sales.repository';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { Pagination } from 'src/type/pagination';
import { ApiResponse } from 'src/type/type';
import { Sales } from 'src/schemas/sales.schema';

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  async createSale(saleData: CreateSaleDto, user_id: string) {
    const newSale = await this.salesRepository.createSale(saleData, user_id);
    return {
      code: 201,
      message: 'Sale created successfully',
      data: newSale,
    };
  }

  async getSalesByUser(
    user_id: string,
    pagination: Pagination,
    filters?: {
      status?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<ApiResponse<Sales[]>> {
    const sales = await this.salesRepository.getSalesByUser(
      user_id,
      pagination,
      filters,
    );
    const salesList = sales.docs.map((item: any) => ({
      ...item.sales_id.toObject(),
      _id: item.sales_id._id,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return {
      code: 200,
      message: 'Sales fetched successfully',
      data: salesList,
      meta: {
        page: sales.page!,
        limit: sales.limit!,
        total: sales.totalDocs!,
        totalPages: sales.totalPages!,
      },
    };
  }

  async getSaleById(sale_id: string) {
    const sale = await this.salesRepository.getSaleById(sale_id);
    return {
      code: 200,
      message: 'Sale fetched successfully',
      data: sale,
    };
  }

  async updateSaleStatus(sale_id: string, status: string) {
    const sale = await this.salesRepository.updateSaleStatus(sale_id, status);
    return {
      code: 200,
      message: 'Sale status updated successfully',
      data: sale,
    };
  }

  async getSalesStats(user_id: string) {
    const stats = await this.salesRepository.getSalesStats(user_id);
    return {
      code: 200,
      message: 'Sales stats fetched successfully',
      data: stats,
    };
  }

  async getSalesForExport(
    user_id: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const sales = await this.salesRepository.getSalesForExport(
      user_id,
      startDate,
      endDate,
    );
    const salesList = sales.map((item: any) => ({
      ...item.sales_id.toObject(),
      _id: item.sales_id._id,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return {
      code: 200,
      message: 'Sales for export fetched successfully',
      data: salesList,
    };
  }
}
