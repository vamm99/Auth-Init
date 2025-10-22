import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../../schemas/product.schema';
import { ProductRepository } from './repository/product.repository';
import { UserProduct, UserProductSchema } from 'src/schemas/user_product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: UserProduct.name, schema: UserProductSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,  // Proporciona el servicio directamente
    ProductRepository,
    // También proporciona el token de inyección para otros módulos
    {
      provide: 'IProductService',
      useExisting: ProductService,  // Usa useExisting en lugar de useClass
    },
  ],
  exports: [
    ProductService,  // Exporta el servicio directamente
    'IProductService',  // También exporta el token
  ],
})
export class ProductModule {}
