import { IsOptional, IsString } from 'class-validator';

export class QueryRestaurantTableDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  restaurant_id?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  minCapacity?: string;

  @IsOptional()
  @IsString()
  maxCapacity?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
