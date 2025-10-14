import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/core/jwt-auth.guard';
import { RolesGuard } from './modules/auth/core/roles.guard';
import { CategoryModule } from './modules/category/category.module';
import { KardexModule } from './modules/kardex/kardex.module';
import { SalesModule } from './modules/sales/sales.module';
import { CartModule } from './modules/cart/cart.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal:true
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongoUrl'),
      }),
    }),
    AuthModule,
    ProductModule,
    UserModule,
    CategoryModule,
    KardexModule,
    SalesModule,
    CartModule,
    PaymentModule,
    ReviewModule,
  ],
  providers: [
    {provide: APP_GUARD, useClass: JwtAuthGuard},
    {provide: APP_GUARD, useClass: RolesGuard}
  ],
})
export class AppModule {}
