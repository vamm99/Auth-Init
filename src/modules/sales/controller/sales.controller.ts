import { Controller, Post, Body, Get, Param, Res, Query } from '@nestjs/common';
import { SalesService } from '../service/sales.service';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { User } from 'src/modules/auth/decorators/user.decorator';
import { ProfileDto } from 'src/modules/auth/dto/profile.dto';
import { CreateSaleDto } from '../dto/create-sale.dto';
import express from 'express';


@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles('admin', 'seller', 'buyer', 'customer')
  async createSale(
    @Body() createSaleDto: Omit<CreateSaleDto, 'user_id'>,
    @User() user: ProfileDto
  ) {
    if (!user._id) {
      throw new Error('User ID is required');
    }
    
    return this.salesService.createSale(
      createSaleDto.products,
      createSaleDto.total,
      createSaleDto.payment_id || '',
      user._id.toString()
    );
  }

  @Get('user')
  @Roles('admin', 'seller', 'buyer', 'customer')
  async getUserSales(@User() user: ProfileDto) {
    return this.salesService.getUserSales(user._id);
  }

  @Get('export')
  @Roles('admin', 'seller')
  async exportSales(
    @Res() res: express.Response,
    @User() user: ProfileDto,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    try {
      const sales = await this.salesService.getSalesForExport(
        user._id,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );

      // Devolver los datos en formato JSON para que el frontend los maneje
      return res.status(200).json(sales);
    } catch (error) {
      console.error('Error al exportar ventas:', error);
      return res.status(500).json({
        code: 500,
        message: 'Error al exportar las ventas',
        error: error.message,
      });
    }
  }

  // Mover esta ruta ANTES de la ruta :id
  @Get('stats')
  @Roles('admin', 'seller')
  async getSalesStats(@User() user: ProfileDto) {
    return this.salesService.getSalesStats(user._id);
  }

  // Esta ruta debe ir DESPUÉS de las rutas específicas
  @Get(':id')
  @Roles('admin', 'seller', 'buyer', 'customer')
  async getSaleById(@Param('id') id: string) {
    return this.salesService.getSaleById(id);
  }
}

// @Controller('sales')
// export class SalesController {
//   constructor(private readonly salesService: SalesService) {}

//   @Post()
//   @Roles('admin', 'seller', 'buyer', 'customer')
//   async createSale(
//     @Body() createSaleDto: Omit<CreateSaleDto, 'user_id'>,
//     @User() user: ProfileDto
//   ) {
//     if (!user._id) {
//       throw new Error('User ID is required');
//     }
    
//     return this.salesService.createSale(
//       createSaleDto.products,
//       createSaleDto.total,
//       createSaleDto.payment_id || '',
//       user._id.toString()
//     );
//   }

//   @Get('user')
//   @Roles('admin', 'seller', 'buyer', 'customer')
//   async getUserSales(@User() user: ProfileDto) {
//     return this.salesService.getUserSales(user._id);
//   }

//   @Get(':id')
//   @Roles('admin', 'seller', 'buyer', 'customer')
//   async getSaleById(@Param('id') id: string) {
//     return this.salesService.getSaleById(id);
//   }

//   @Get('stats')
//   @Roles('admin', 'seller')
//   async getSalesStats(@User() user: ProfileDto) {
//     return this.salesService.getSalesStats(user._id);
//   }
// }
