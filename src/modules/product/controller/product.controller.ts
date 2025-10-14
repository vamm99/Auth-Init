import { Controller, Get, Post, Query, Body, Param, Put } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { Pagination } from 'src/type/pagination';
import { RegisterDto } from '../dto/register.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { UpdateDto } from '../dto/update.dto';
import { User } from 'src/modules/auth/decorators/user.decorator';
import { ProfileDto } from 'src/modules/auth/dto/profile.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('register')
  @Roles('admin', 'seller')  
  async createProduct(@Body() product: RegisterDto, @User() user: ProfileDto) {
    return this.productService.createProduct(product, user._id);
  }

  @Public()
  @Get()
  async getAllProducts(@Query() pagination: Pagination) {
    return this.productService.getAllProducts(pagination);
  }

  @Roles('admin', 'seller')
  @Get('user')
  async getAllProductsByUser(@Query() pagination: Pagination, @User() user: ProfileDto) {
    return this.productService.getAllProductsByUser(user._id, pagination);
  }

  @Roles('admin', 'seller')
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Roles('admin', 'seller')
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() product: UpdateDto) {
    return this.productService.updateProduct(id, product);
  }

  @Roles('admin', 'seller')
  @Put(':id')
  async changeStatusProduct(@Param('id') id: string, @Body() product: UpdateDto) {
    return this.productService.changeStatus(id, product.status!);
  }
}
