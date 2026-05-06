// src/menu-order-item/dto/query-menu-order-item.dto.ts
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  OrderCategory,
  PaymentStatus,
} from '../entities/menu-order-item.entity';

export class QueryMenuOrderItemDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsUUID()
  hotel_id?: string;

  @IsOptional()
  @IsUUID()
  restaurant_id?: string;

  @IsOptional()
  @IsUUID()
  table_id?: string;

  @IsOptional()
  @IsUUID()
  room_id?: string;

  @IsOptional()
  @IsUUID()
  menu_item_id?: string;

  @IsOptional()
  @IsEnum(OrderCategory)
  category?: OrderCategory;

  @IsOptional()
  @IsEnum(PaymentStatus)
  payment_status?: PaymentStatus;

  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
