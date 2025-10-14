import { IsBoolean, IsNumber, IsString, Min } from "class-validator";

export class RegisterDto {

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    image_url: string;

    @IsNumber()
    @Min(0)
    cost: number;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsNumber()
    @Min(0)
    discount: number;

    @IsBoolean()
    status: boolean;

    @IsString()
    category_id: string;
}
