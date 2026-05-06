import { IsOptional, IsString } from 'class-validator';

export class QueryHotelsDto {
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
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  minRating?: string;

  @IsOptional()
  @IsString()
  maxRating?: string;

  @IsOptional()
  @IsString()
  minRooms?: string;

  @IsOptional()
  @IsString()
  maxRooms?: string;
}
