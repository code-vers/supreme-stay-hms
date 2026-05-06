// src/menu-order-item/dto/create-menu-order-item.dto.ts
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { OrderCategory } from '../entities/menu-order-item.entity';

export class CreateMenuOrderItemDto {
  @IsUUID()
  hotel_id: string;

  @IsUUID()
  restaurant_id: string;

  @IsUUID()
  menu_item_id: string;

  @IsEnum(OrderCategory)
  category: OrderCategory;

  @ValidateIf((o) => !o.room_id)
  @IsUUID()
  table_id?: string;

  @ValidateIf((o) => !o.table_id)
  @IsUUID()
  room_id?: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  subtotal: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  delivery_time?: Date;
}
