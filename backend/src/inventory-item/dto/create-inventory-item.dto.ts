// src/inventory-item/dto/create-inventory-item.dto.ts
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ItemCategory, ItemUnit } from '../entities/inventory-item.entity';

export class CreateInventoryItemDto {
  @IsUUID()
  hotel_id: string;

  @IsUUID()
  suppliers_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ItemCategory)
  category: ItemCategory;

  @IsEnum(ItemUnit)
  unit: ItemUnit;

  @IsInt()
  @Min(0)
  current_stock: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  low_stock_threshold?: number;

  @IsNumber()
  @IsPositive()
  cost_price: number;
}
