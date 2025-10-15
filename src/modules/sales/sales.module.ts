import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesService } from './service/sales.service';
import { SalesController } from './controller/sales.controller';
import { SalesRepository } from './repository/sales.repository';
import { Sales, SalesSchema } from 'src/schemas/sales.schema';
import { UserSales, UserSalesSchema } from 'src/schemas/user_sales.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sales.name, schema: SalesSchema },
      { name: UserSales.name, schema: UserSalesSchema },
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService, SalesRepository],
  exports: [SalesService],
})
export class SalesModule {}
