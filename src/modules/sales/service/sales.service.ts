import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SalesRepository } from '../repository/sales.repository';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { Pagination } from 'src/type/pagination';
import { ApiResponse, PaginationMeta } from 'src/type/type';
import { Sales, SalesStatus } from 'src/schemas/sales.schema';
import { Kardex, KardexDocument } from 'src/schemas/kardex.schema';
import { ProductKardex, ProductKardexDocument } from 'src/schemas/product_kardex.schema';
import * as productInterface from '../../product/interfaces/product-service.interface';
import { ProductInSale, SalesResponse } from 'src/type/sales';

interface ProductSaleInput {
  product_id: string;
  price: number;
  quantity: number;
  name: string;
  image_url?: string;
}

interface SalesFilter {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

@Injectable()
export class SalesService {
  constructor(
    private readonly salesRepository: SalesRepository,
    @Inject('IProductService')
    private readonly productService: productInterface.IProductService,
    @InjectModel(Kardex.name) private kardexModel: Model<KardexDocument>,
    @InjectModel(ProductKardex.name) private productKardexModel: Model<ProductKardexDocument>
  ) {}


  async createSale(
    products: ProductSaleInput[],
    total: number,
    payment_id: string,
    user_id: string
  ): Promise<ApiResponse<SalesResponse>> {
    try {
      console.log('Iniciando creación de venta para usuario:', user_id);
      
      // Validate products and get product details (including name and image)
      const productDetails = await Promise.all(
        products.map(async (item) => {
          await this.validateProductStock(item.product_id, item.quantity);
          
          // Get full product details
          const response = await this.productService.getProductById(item.product_id);
          if (!response || !response.data) {
            throw new Error(`Producto con ID ${item.product_id} no encontrado`);
          }
          
          return {
            product_id: item.product_id,
            name: item.name || response.data.name,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url || response.data.image_url || ''
          };
        })
      );
  
      const saleData: CreateSaleDto = {
        products: productDetails,
        total,
        payment_id,
        status: SalesStatus.PENDING,
        user_id
      };
  
      console.log('Datos de la venta a crear:', JSON.stringify(saleData, null, 2));
      
      const newSale = await this.salesRepository.createSale(saleData, user_id);
      
      if (!newSale) {
        throw new Error('No se pudo crear la venta: respuesta vacía del repositorio');
      }
      
      console.log('Venta creada exitosamente, actualizando stock...');
      
      // Update product stock after successful sale
      await Promise.all(
        products.map(item => 
          this.updateProductStock(item.product_id, item.quantity)
        )
      );
      
      console.log('Transacción completada exitosamente');
      
      // Convert the newSale document to a plain response
      // The repository already returns a populated document from getSaleById
      const saleObj = newSale.toObject ? newSale.toObject() : newSale;
      
      // Simple conversion - just convert _id fields to strings
      const responseData: SalesResponse = {
        _id: saleObj._id.toString(),
        products: saleObj.products.map((p: any) => ({
          product_id: p.product_id, // Keep as is
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          image_url: p.image_url || ''
        })),
        total: saleObj.total,
        user_id: saleObj.user_id.toString(),
        status: saleObj.status,
        orderNumber: saleObj.orderNumber,
        payment_id: saleObj.payment_id,
        createdAt: saleObj.createdAt,
        updatedAt: saleObj.updatedAt
      };
      
      return {
        code: 201,
        message: 'Venta creada exitosamente',
        data: responseData
      };
    } catch (error) {
      console.error('Error en createSale:', error);
      
      // Log detailed error information
      if (error.name === 'ValidationError') {
        console.error('Error de validación:', error.errors);
      } else if (error.code === 11000) {
        console.error('Error de duplicado:', error.keyValue);
      }
      
      return {
        code: 500,
        message: `Error al crear la venta: ${error.message}`,
        data: undefined
      };
    }
  }


  private async validateProductStock(productId: string, quantity: number): Promise<void> {
    try {
      const response = await this.productService.getProductById(productId);
      if (!response || !response.data) {
        throw new Error(`Producto con ID ${productId} no encontrado`);
      }
      
      const product = response.data;
      if (product.stock < quantity) {
        throw new Error(`Stock insuficiente para el producto ${product.name}. Disponible: ${product.stock}, Solicitado: ${quantity}`);
      }
    } catch (error) {
      throw new Error(`Error validando stock del producto: ${error.message}`);
    }
  }

  private async updateProductStock(productId: string, quantityChange: number): Promise<void> {
    try {
      // 1. Obtener el producto actual para saber el stock
      const productResponse = await this.productService.getProductById(productId);
      if (!productResponse || !productResponse.data) {
        throw new Error(`Producto con ID ${productId} no encontrado`);
      }
      
      const currentStock = productResponse.data.stock;
      const newStock = currentStock - quantityChange;
      
      // 2. Actualizar el stock del producto
      const response = await this.productService.updateOne(
        { _id: new Types.ObjectId(productId) },
        { $inc: { stock: -quantityChange } }
      );
      
      if (!response || response.code !== 200) {
        throw new Error('No se pudo actualizar el stock del producto');
      }
      
      // Verify the stock was actually updated
      if (response.modifiedCount === 0) {
        throw new Error('No se pudo actualizar el stock del producto: el producto no fue encontrado o no hubo cambios');
      }
      
      // 3. Crear registro en Kardex
      const kardex = await this.kardexModel.create({
        comment: `Venta - Stock descontado`,
        quantity: quantityChange,
        stock: newStock,
      });
      
      // 4. Crear relación Product-Kardex
      await this.productKardexModel.create({
        product_id: new Types.ObjectId(productId),
        kardex_id: kardex._id,
      });
      
      console.log(`✅ Stock actualizado y kardex creado para producto ${productId}: ${currentStock} -> ${newStock}`);
    } catch (error) {
      throw new Error(`Error actualizando stock del producto: ${error.message}`);
    }
  }
async getUserSales(user_id: string): Promise<ApiResponse<Sales[]>> {
    try {
      const sales = await this.salesRepository.getSalesByUser(user_id, { page: 1, limit: 100 });
      
      // Check if sales has a docs property (pagination result) or is an array
      const salesData = Array.isArray(sales) ? sales : sales.docs || [];
      
      const salesList = salesData.map(item => {
        // If item has a sales_id (from populate/join), use that, otherwise use the item itself
        const saleItem = item.sales_id ? item.sales_id.toObject() : item.toObject ? item.toObject() : item;
        return {
          _id: saleItem._id,
          products: saleItem.products || [],
          total: saleItem.total,
          user_id: saleItem.user_id,
          status: saleItem.status,
          orderNumber: saleItem.orderNumber,
          payment_id: saleItem.payment_id,
          createdAt: saleItem.createdAt || item.createdAt,
          updatedAt: saleItem.updatedAt || item.updatedAt,
        };
      });

      return {
        code: 200,
        message: 'Ventas obtenidas exitosamente',
        data: salesList,
        meta: {
          page: sales.page || 1,
          limit: sales.limit || 10,
          total: Number(sales.totalDocs || sales.total || 0),
          totalPages: sales.totalPages || 1,
        },
      };
    } catch (error) {
      console.error('Error obteniendo ventas del usuario:', error);
      return {
        code: 500,
        message: `Error al obtener las Ventas: ${error.message}`,
        data: [],
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  async getSalesByUser(
    user_id: string,
    pagination: Pagination,
    filters: SalesFilter = {}
  ): Promise<ApiResponse<SalesResponse[]>> {
    try {
      // Validate pagination parameters
      const page = Math.max(1, pagination?.page || 1);
      const limit = Math.min(100, Math.max(1, pagination?.limit || 10));
      
      // Convert string dates to Date objects if they exist
      const startDate = filters?.startDate ? new Date(filters.startDate) : undefined;
      const endDate = filters?.endDate ? new Date(filters.endDate) : undefined;
      
      // Get paginated sales from repository
      const sales = await this.salesRepository.getSalesByUser(
        user_id,
        { page, limit },
        {
          status: filters?.status as SalesStatus,
          startDate,
          endDate,
          search: filters?.search
        }
      );

      // Format the sales data
      const salesList: SalesResponse[] = sales.docs.map(sale => {
        const saleObj = sale.toObject ? sale.toObject() : sale;
        return {
          ...saleObj,
          _id: sale._id.toString(),
          user_id: sale.user_id.toString(),
          status: sale.status,
          orderNumber: sale.orderNumber,
          total: sale.total,
          payment_id: sale.payment_id,
          createdAt: sale.createdAt,
          updatedAt: sale.updatedAt,
          // Format products array
          products: Array.isArray(sale.products) ? sale.products.map(product => {
            // If product_id is populated, use its data, otherwise use the product data
            const productId = (product.product_id as any)?._id 
              ? {
                  _id: new Types.ObjectId((product.product_id as any)._id.toString()),
                  name: (product.product_id as any).name || product.name,
                  price: (product.product_id as any).price || product.price,
                  image_url: (product.product_id as any).image_url || product.image_url
                }
              : new Types.ObjectId(product.product_id.toString());

            return {
              product_id: productId,
              name: product.name,
              price: product.price,
              quantity: product.quantity,
              image_url: product.image_url
            };
          }) : []
        } as SalesResponse;
      });

      // Return formatted response with pagination metadata
      return {
        code: 200,
        message: 'Ventas obtenidas exitosamente',
        data: salesList,
        meta: {
          page: sales.page || page,
          limit: sales.limit || limit,
          total: Number(sales.totalDocs || sales.total || 0),
          totalPages: sales.totalPages || 1,
          hasNextPage: sales.hasNextPage || false,
          hasPrevPage: sales.hasPrevPage || false,
          pagingCounter: sales.pagingCounter || 1,
          nextPage: sales.nextPage || null,
          prevPage: sales.prevPage || null
        } as PaginationMeta,
      };
    } catch (error) {
      console.error('Error obteniendo ventas:', error);
      return {
        code: 500,
        message: `Error al obtener las ventas: ${error.message}`,
        data: [],
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        } as PaginationMeta,
      };
    }
  }

  async getSaleById(sale_id: string): Promise<ApiResponse<Sales>> {
    try {
      const sale = await this.salesRepository.getSaleById(sale_id);
      if (!sale) {
        throw new Error('Venta no encontrada');
      }
      
      return {
        code: 200,
        message: 'Venta obtenida exitosamente',
        data: sale,
      };
    } catch (error) {
      console.error('Error obteniendo venta:', error);
      throw new Error(`Error al obtener la venta: ${error.message}`);
    }
  }

  async getSalesStats(user_id: string): Promise<ApiResponse<any>> {
    try {
      const stats = await this.salesRepository.getSalesStats(user_id);
      return {
        code: 200,
        message: 'Estadísticas de ventas obtenidas exitosamente',
        data: stats,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de ventas:', error);
      throw new Error(`Error al obtener las estadísticas de ventas: ${error.message}`);
    }
  }

  // In sales.repository.ts, update the getSalesForExport method:
  async getSalesForExport(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ApiResponse<any[]>> {
    try {
      const sales = await this.salesRepository.getSalesForExport(
        userId,
        startDate,
        endDate,
      );
  
      // Formatear los datos correctamente para el frontend
      const formattedSales = sales.map((sale) => ({
        _id: sale._id,
        orderNumber: sale.orderNumber,
        status: sale.status,
        total: sale.total,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
        user_id: sale.user_id,
        products: sale.products.map((p: any) => ({
          product_id: p.product_id,
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          image_url: p.image_url || '',
          subtotal: p.price * p.quantity,
        })),
      }));
  
      return {
        code: 200,
        message: 'Ventas para exportación obtenidas exitosamente',
        data: formattedSales,
      };
    } catch (error) {
      console.error('Error obteniendo ventas para exportación:', error);
      throw new Error(`Error al obtener las ventas para exportación: ${error.message}`);
    }
  }

  // async getSalesForExport(
  //   user_id: string,
  //   startDate?: Date,
  //   endDate?: Date,
  // ): Promise<ApiResponse<Sales[]>> {
  //   try {
  //     const sales = await this.salesRepository.getSalesForExport(
  //       user_id,
  //       startDate,
  //       endDate,
  //     );

  //     const salesList = sales.map((sale) => ({
  //       _id: sale._id,
  //       user_id: sale.user_id,  // Add this line
  //       createdAt: sale.createdAt,
  //       updatedAt: sale.updatedAt,
  //       // Also include any other required fields from the Sales type
  //       orderNumber: sale.orderNumber,
  //       status: sale.status,
  //       total: sale.total,
  //       products: sale.products
  //     }));

  //     return {
  //       code: 200,
  //       message: 'Ventas para exportación obtenidas exitosamente',
  //       data: salesList,
  //     };
  //   } catch (error) {
  //     console.error('Error obteniendo ventas para exportación:', error);
  //     throw new Error(`Error al obtener las ventas para exportación: ${error.message}`);
  //   }
  // }
}