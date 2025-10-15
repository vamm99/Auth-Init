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

    async getAllProductsByUser(
        user_id: string,
        query: Pagination & {
            search?: string;
            category_id?: string;
            status?: string;
            minPrice?: string;
            maxPrice?: string;
        }
    ): Promise<ApiResponse<Product[]>> {
        const pagination = { page: query.page, limit: query.limit };
        const products = await this.productRepository.getAllProductsByUser(user_id, pagination);

        let productList = products.docs.map((item: any) => item.product_id);

        // Aplicar filtros en el servicio después del populate
        if (query.search) {
            const searchRegex = new RegExp(query.search, 'i');
            productList = productList.filter((product: any) =>
                searchRegex.test(product.name)
            );
        }

        if (query.category_id) {
            productList = productList.filter((product: any) =>
                product.category_id && product.category_id._id?.toString() === query.category_id
            );
        }

        if (query.status !== undefined) {
            productList = productList.filter((product: any) =>
                product.status === (query.status === 'true')
            );
        }

        if (query.minPrice) {
            productList = productList.filter((product: any) =>
                product.price >= parseFloat(query.minPrice!)
            );
        }

        if (query.maxPrice) {
            productList = productList.filter((product: any) =>
                product.price <= parseFloat(query.maxPrice!)
            );
        }

        // Aplicar paginación manual a los resultados filtrados
        const total = productList.length;
        const totalPages = Math.ceil(total / (query.limit || 10));
        const startIndex = ((query.page || 1) - 1) * (query.limit || 10);
        const endIndex = startIndex + (query.limit || 10);
        const paginatedProducts = productList.slice(startIndex, endIndex);

        return {
            code: 200,
            message: 'Products fetched successfully',
            data: paginatedProducts,
            meta: {
                page: query.page || 1,
                limit: query.limit || 10,
                total: total,
                totalPages: totalPages
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
        };
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
