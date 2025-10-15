import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UserRole, typeDocument } from "src/schemas/user.schema";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    idNumber?: string;

    @IsOptional()
    @IsEnum(typeDocument)
    typeDocument?: typeDocument;

    @IsOptional()
    @IsString()
    phone?: string;
    
    @IsOptional()
    @IsEmail()
    email?: string;
    
    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(12)
    password?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsBoolean()
    status?: boolean;
}
