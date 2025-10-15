import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { SalesService } from '../service/sales.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { QuerySaleDto } from '../dto/query-sale.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { User } from 'src/modules/auth/decorators/user.decorator';
import { ProfileDto } from 'src/modules/auth/dto/profile.dto';

@Controller('sales')
@Roles('admin', 'seller')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  /**
   * Crear una nueva venta
   * POST /sales
   */
  @Post()
  async createSale(
    @Body() saleData: CreateSaleDto,
    @User() user: ProfileDto,
  ) {
    return this.salesService.createSale(saleData, user._id);
  }

  /**
   * Obtener ventas del usuario con paginación y filtros
   * GET /sales?page=1&limit=10&status=completed&startDate=2024-01-01&endDate=2024-12-31
   */
  @Get()
  async getSalesByUser(
    @Query() query: QuerySaleDto,
    @User() user: ProfileDto,
  ) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const filters: any = {};

    if (query.status) filters.status = query.status;
    if (query.startDate) filters.startDate = new Date(query.startDate);
    if (query.endDate) filters.endDate = new Date(query.endDate);

    return this.salesService.getSalesByUser(user._id, { page, limit }, filters);
  }

  /**
   * Obtener estadísticas de ventas del usuario
   * GET /sales/stats
   */
  @Get('stats')
  async getSalesStats(@User() user: ProfileDto) {
    return this.salesService.getSalesStats(user._id);
  }

  /**
   * Obtener ventas para exportar (sin paginación)
   * GET /sales/export?startDate=2024-01-01&endDate=2024-12-31
   */
  @Get('export')
  async getSalesForExport(
    @Query() query: QuerySaleDto,
    @User() user: ProfileDto,
  ) {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    return this.salesService.getSalesForExport(user._id, startDate, endDate);
  }

  /**
   * Obtener una venta por ID
   * GET /sales/:id
   */
  @Get(':id')
  async getSaleById(@Param('id') id: string) {
    return this.salesService.getSaleById(id);
  }

  /**
   * Actualizar estado de una venta
   * PUT /sales/:id/status
   */
  @Put(':id/status')
  async updateSaleStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.salesService.updateSaleStatus(id, status);
  }
}
