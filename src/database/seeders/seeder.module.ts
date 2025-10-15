import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseSeeder } from './database.seeder';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { UserProduct, UserProductSchema } from 'src/schemas/user_product.schema';
import { Sales, SalesSchema } from 'src/schemas/sales.schema';
import { UserSales, UserSalesSchema } from 'src/schemas/user_sales.schema';
import { Kardex, KardexSchema } from 'src/schemas/kardex.schema';
import { ProductKardex, ProductKardexSchema } from 'src/schemas/product_kardex.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: UserProduct.name, schema: UserProductSchema },
      { name: Sales.name, schema: SalesSchema },
      { name: UserSales.name, schema: UserSalesSchema },
      { name: Kardex.name, schema: KardexSchema },
      { name: ProductKardex.name, schema: ProductKardexSchema },
    ]),
  ],
  providers: [DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class SeederModule {}
