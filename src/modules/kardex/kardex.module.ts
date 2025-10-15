import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KardexService } from './service/kardex.service';
import { KardexController } from './controller/kardex.controller';
import { KardexRepository } from './repository/kardex.repository';
import { Kardex, KardexSchema } from 'src/schemas/kardex.schema';
import { ProductKardex, ProductKardexSchema } from 'src/schemas/product_kardex.schema';
import { UserProduct, UserProductSchema } from 'src/schemas/user_product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Kardex.name, schema: KardexSchema },
      { name: ProductKardex.name, schema: ProductKardexSchema },
      { name: UserProduct.name, schema: UserProductSchema },
    ]),
  ],
  controllers: [KardexController],
  providers: [KardexService, KardexRepository],
  exports: [KardexService],
})
export class KardexModule {}
