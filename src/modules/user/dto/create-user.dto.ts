import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UserRole, typeDocument } from "src/schemas/user.schema";

export class CreateUserDto {
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
    @IsEnum(typeDocument)
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

    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;

    @IsBoolean()
    @IsOptional()
    status?: boolean;
}
