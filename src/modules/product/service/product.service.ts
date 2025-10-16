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
        // Si hay filtros, necesitamos obtener TODOS los productos para filtrar
        const hasFilters = query.search || query.category_id || query.status !== undefined || query.minPrice || query.maxPrice;
        
        const pagination = hasFilters 
            ? { page: 1, limit: 10000 } // Obtener todos si hay filtros
            : { page: query.page, limit: query.limit }; // Paginación normal si no hay filtros
        
        const products = await this.productRepository.getAllProductsByUser(user_id, pagination);

        let productList = products.docs.map((item: any) => item.product_id).filter((p: any) => p !== null);

        // Aplicar filtros en el servicio después del populate
        if (query.search) {
            const searchRegex = new RegExp(query.search, 'i');
            productList = productList.filter((product: any) =>
                searchRegex.test(product.name) || searchRegex.test(product.description)
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

        // Calcular totales después de filtrar
        const total = productList.length;
        const limit = query.limit || 10;
        const totalPages = Math.ceil(total / limit);
        
        // Aplicar paginación manual solo si hay filtros
        let paginatedProducts = productList;
        if (hasFilters) {
            const startIndex = ((query.page || 1) - 1) * limit;
            const endIndex = startIndex + limit;
            paginatedProducts = productList.slice(startIndex, endIndex);
        }

        return {
            code: 200,
            message: 'Products fetched successfully',
            data: paginatedProducts,
            meta: {
                page: query.page || 1,
                limit: limit,
                total: hasFilters ? total : products.totalDocs || total,
                totalPages: hasFilters ? totalPages : products.totalPages || totalPages
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
