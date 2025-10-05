import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
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
}
