import { IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "src/schemas/user.schema";

export class QueryUserDto {
    @IsOptional()
    @IsString()
    page?: string;

    @IsOptional()
    @IsString()
    limit?: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsString()
    status?: string;
}
