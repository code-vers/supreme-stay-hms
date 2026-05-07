// src/purchase-item/dto/create-purchase-item.dto.ts
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreatePurchaseItemDto {
  @IsUUID()
  hotel_id: string;

  @IsUUID()
  item_id: string;

  @IsUUID()
  supplier_id: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  cost_price: number;

  @IsNumber()
  @IsPositive()
  subtotal: number;

  @IsNumber()
  @IsPositive()
  total_amount: number;

  @IsString()
  @IsOptional()
  note?: string;
}
