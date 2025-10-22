import { Document } from 'mongoose';
import { Product } from 'src/schemas/product.schema';
import { RegisterDto } from '../dto/register.dto';
import { UpdateDto } from '../dto/update.dto';
import { Pagination } from 'src/type/pagination';
import { ApiResponse } from 'src/type/type';

export interface IProductService {
  // Métodos del controlador
  createProduct(product: RegisterDto, userId: string): Promise<any>;
  getAllProducts(query: Pagination & {
    search?: string;
    category_id?: string;
    minPrice?: string;
    maxPrice?: string;
  }): Promise<any>;
  getAllProductsByUser(
    userId: string,
    query: Pagination & {
      search?: string;
      category_id?: string;
      status?: string;
      minPrice?: string;
      maxPrice?: string;
    }
  ): Promise<any>;
  updateProduct(id: string, updateData: UpdateDto, userId: string): Promise<any>;
  changeStatus(id: string, status: boolean): Promise<any>;
  
  // Métodos internos
  getProductById(id: string): Promise<ApiResponse<Product>>;
  updateOne(filter: any, update: any): Promise<any>;
}
