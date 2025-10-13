import { IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";
import { typeDocument } from "src/schemas/user.schema";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    idNumber: string;

    @IsNotEmpty()
    @IsString()
    typeDocument: typeDocument;

    @IsNotEmpty()
    @IsString()
    phone: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(12)
    password: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsBoolean()
    @IsNotEmpty()
    status: boolean;
}
