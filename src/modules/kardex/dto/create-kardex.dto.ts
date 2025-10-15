import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateKardexDto {
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;
}
