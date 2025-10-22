import { IsArray, IsNotEmpty, IsNumber, IsString, IsOptional, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SalesStatus } from 'src/schemas/sales.schema';

class ProductItemDto {
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  image_url?: string;
}

export class CreateSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  products: ProductItemDto[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  total: number;

  @IsString()
  @IsOptional()
  payment_id?: string;

  @IsString()
  @IsOptional()
  status?: SalesStatus;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
