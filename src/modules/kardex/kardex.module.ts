import { Module } from '@nestjs/common';
import { KardexService } from './service/kardex.service';
import { KardexController } from './controller/kardex.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Kardex, KardexSchema } from '../../schemas/kardex.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Kardex.name, schema: KardexSchema }])],
  controllers: [KardexController],
  providers: [KardexService],
})
export class KardexModule {}
