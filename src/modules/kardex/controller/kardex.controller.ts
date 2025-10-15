import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { KardexService } from '../service/kardex.service';
import { CreateKardexDto } from '../dto/create-kardex.dto';
import { QueryKardexDto } from '../dto/query-kardex.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { User } from 'src/modules/auth/decorators/user.decorator';
import { ProfileDto } from 'src/modules/auth/dto/profile.dto';

@Controller('kardex')
@Roles('admin', 'seller')
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  /**
   * Crear un movimiento de kardex
   * POST /kardex
   */
  @Post()
  async createKardex(@Body() kardexData: CreateKardexDto) {
    return this.kardexService.createKardex(kardexData);
  }

  /**
   * Obtener inventario del usuario
   * GET /kardex/inventory
   */
  @Get('inventory')
  async getInventoryByUser(@User() user: ProfileDto) {
    return this.kardexService.getInventoryByUser(user._id);
  }

  /**
   * Obtener estadísticas de inventario
   * GET /kardex/stats
   */
  @Get('stats')
  async getInventoryStats(@User() user: ProfileDto) {
    return this.kardexService.getInventoryStats(user._id);
  }

  /**
   * Obtener kardex para exportar
   * GET /kardex/export?startDate=2024-01-01&endDate=2024-12-31
   */
  @Get('export')
  async getKardexForExport(
    @Query() query: QueryKardexDto,
    @User() user: ProfileDto,
  ) {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    return this.kardexService.getKardexForExport(user._id, startDate, endDate);
  }

  /**
   * Obtener movimientos de kardex por producto
   * GET /kardex/product/:id?page=1&limit=10
   */
  @Get('product/:id')
  async getKardexByProduct(
    @Param('id') product_id: string,
    @Query() query: QueryKardexDto,
  ) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const filters: any = {};

    if (query.startDate) filters.startDate = new Date(query.startDate);
    if (query.endDate) filters.endDate = new Date(query.endDate);

    return this.kardexService.getKardexByProduct(
      product_id,
      { page, limit },
      filters,
    );
  }
}
