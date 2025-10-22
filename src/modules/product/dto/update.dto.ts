import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateDto {
    @IsString()
    name?: string;

    @IsString()
    description?: string;

    @IsString()
    image_url?: string;

    @IsNumber()
    cost?: number;

    @IsNumber()
    price?: number;

    @IsNumber()
    stock?: number;

    @IsNumber()
    discount?: number;

    @IsBoolean()
    status?: boolean;

    @IsString()
    category_id?:any;
}

export class changeStatus {
    @IsBoolean()
    @IsNotEmpty()
    status: boolean;
}
    