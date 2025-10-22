import { Controller, Get, Post, Query, Body, Param, Put, Inject } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { Pagination } from 'src/type/pagination';
import { RegisterDto } from '../dto/register.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { changeStatus, UpdateDto } from '../dto/update.dto';
import { User } from 'src/modules/auth/decorators/user.decorator';
import { ProfileDto } from 'src/modules/auth/dto/profile.dto';
import type { IProductService } from '../interfaces/product-service.interface';

@Controller('product')
export class ProductController {
  constructor(
    @Inject('IProductService')
    private readonly productService: IProductService
  ) {}

  @Post('register')
  @Roles('admin', 'seller')
  async createProduct(@Body() product: RegisterDto, @User() user: ProfileDto) {
    return this.productService.createProduct(product, user._id);
  }

  @Public()
  @Get()
  async getAllProducts(
    @Query() query: Pagination & {
      search?: string;
      category_id?: string;
      minPrice?: string;
      maxPrice?: string;
    }
  ) {
    return this.productService.getAllProducts(query);
  }

  @Roles('admin', 'seller')
  @Get('user')
  async getAllProductsByUser(
    @Query() query: Pagination & {
      search?: string;
      category_id?: string;
      status?: string;
      minPrice?: string;
      maxPrice?: string;
    },
    @User() user: ProfileDto
  ) {
    return this.productService.getAllProductsByUser(user._id, query);
  }

  @Public()
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Roles('admin', 'seller')
  @Put(':id')
  async updateProduct(
    @Param('id') id: string, 
    @Body() product: UpdateDto,
    @User() user: ProfileDto
  ) {
    // Si category_id es un objeto, extrae solo el ID
    if (product.category_id && typeof product.category_id === 'object') {
      product.category_id = product.category_id._id || product.category_id.id;
    }
    return this.productService.updateProduct(id, product, user._id);
  }

  @Roles('admin', 'seller')
  @Put(':id/status')
  async changeStatusProduct(
    @Param('id') id: string, 
    @Body() product: changeStatus,
    @User() user: ProfileDto
  ) {
    return this.productService.changeStatus(id, product.status);
  }
}
