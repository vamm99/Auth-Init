import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';
import { Payment, PaymentSchema } from 'src/schemas/payment.schema';
import { UserPayment, UserPaymentSchema } from 'src/schemas/user_payment.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { Kardex, KardexSchema } from 'src/schemas/kardex.schema';
import { ProductKardex, ProductKardexSchema } from 'src/schemas/product_kardex.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: UserPayment.name, schema: UserPaymentSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Kardex.name, schema: KardexSchema },
      { name: ProductKardex.name, schema: ProductKardexSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
