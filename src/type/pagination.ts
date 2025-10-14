import { IsNumber, IsOptional, Min } from "class-validator";

export class Pagination {
    @IsOptional()
    page? = 1;
  
    @IsOptional()
    limit? = 10;
}
