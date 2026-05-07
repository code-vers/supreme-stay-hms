// src/inventory-item/dto/query-inventory-item.dto.ts
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ItemCategory, ItemStatus } from '../entities/inventory-item.entity';

export class QueryInventoryItemDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() limit?: string;
  @IsOptional() @IsUUID() hotel_id?: string;
  @IsOptional() @IsUUID() suppliers_id?: string;
  @IsOptional() @IsEnum(ItemCategory) category?: ItemCategory;
  @IsOptional() @IsEnum(ItemStatus) status?: ItemStatus;
  @IsOptional() @IsString() search?: string;
}
