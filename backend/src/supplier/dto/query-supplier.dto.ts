// src/supplier/dto/query-supplier.dto.ts
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class QuerySupplierDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() limit?: string;
  @IsOptional() @IsUUID() hotel_id?: string;
  @IsOptional() @IsString() search?: string; // name, email, phone
}
