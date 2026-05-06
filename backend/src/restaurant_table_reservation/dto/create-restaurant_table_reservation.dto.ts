// src/reservation/dto/create-reservation.dto.ts
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { OrderType } from '../entities/restaurant_table_reservation.entity';

export class CreateReservationDto {
  @IsUUID()
  restaurant_id: string;

  @IsUUID()
  table_id: string;

  @IsEnum(OrderType)
  order_type: OrderType;

  @IsInt()
  @IsPositive()
  total_amount: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsInt()
  @IsPositive()
  grand_total: number;

  @IsString()
  @IsNotEmpty()
  order_by: string;

  @IsDateString()
  reservation_date: string;

  @IsInt()
  @Min(15)
  @IsOptional()
  booking_duration_minutes?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  guest_count?: number;

  @IsString()
  @IsOptional()
  special_request?: string;
}
