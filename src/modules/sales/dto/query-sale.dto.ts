import { IsOptional, IsString, IsEnum } from 'class-validator';
import { SalesStatus } from 'src/schemas/sales.schema';

export class QuerySaleDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsEnum(SalesStatus)
  status?: SalesStatus;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
