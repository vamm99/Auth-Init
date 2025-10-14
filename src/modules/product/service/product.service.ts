import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { RegisterDto } from '../dto/register.dto';
import { Pagination } from 'src/type/pagination';
import { ApiResponse } from 'src/type/type';
import { Product } from 'src/schemas/product.schema';
import { UpdateDto } from '../dto/update.dto';

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) {}

    async createProduct(product: RegisterDto, user_id: string) {
        const newProduct = await this.productRepository.createProduct(product, user_id);
        return {
            code: 2001,
            message: 'Product created successfully',
            data: newProduct
        };
    }

    async getAllProductsByUser(user_id: string, pagination: Pagination): Promise<ApiResponse<Product[]>> {
        const products = await this.productRepository.getAllProductsByUser(user_id, pagination);
        const productList = products.docs.map((item: any) => item.product_id);
        return {
            code: 200,
            message: 'Products fetched successfully',
            data: productList,
            meta: {
                page: products.page!,
                limit: products.limit!,
                total: products.totalDocs!,
                totalPages: products.totalPages!
            }
        };
    }

    async getAllProducts(pagination: Pagination): Promise<ApiResponse<Product[]>> {
        const products = await this.productRepository.getAllProducts(pagination);
        return {
            code: 200,
            message: 'Products fetched successfully',
            data: products.docs,
            meta: {
                page: products.page!,
                limit: products.limit!,
                total: products.totalDocs!,
                totalPages: products.totalPages!
            }
        }
    }

    async getProductById(id: string) {
        const product = await this.productRepository.getProductById(id);
        return {
            code: 200,
            message: 'Product fetched successfully',
            data: product
        };
    }

    async updateProduct(id: string, product: UpdateDto) {
        const updatedProduct = await this.productRepository.updateProduct(id, product);
        return {
            code: 200,
            message: 'Product updated successfully',
            data: updatedProduct
        };
    }

    async changeStatus(id: string, status: boolean) {
        const updatedProduct = await this.productRepository.changeStatus(id, status);
        return {
            code: 200,
            message: 'Product status updated successfully',
            data: updatedProduct
        };
    }
}
