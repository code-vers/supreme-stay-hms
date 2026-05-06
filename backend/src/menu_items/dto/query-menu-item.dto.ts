// src/menu-item/dto/query-menu-item.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class QueryMenuItemDto {
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
  @IsString()
  is_available?: string; // 'true' | 'false'

  @IsOptional()
  @IsString()
  minPrice?: string;

  @IsOptional()
  @IsString()
  maxPrice?: string;
}
