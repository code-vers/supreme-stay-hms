// src/booking/dto/query-booking.dto.ts
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  BookingStatus,
  BookingType,
  PaymentStatus,
} from '../entities/booking.entity';

export class QueryBookingDto {
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
  room_id?: string;

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  booking_status?: BookingStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  payment_status?: PaymentStatus;

  @IsOptional()
  @IsEnum(BookingType)
  booking_type?: BookingType;

  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;

  @IsOptional()
  @IsString()
  search?: string; // guest_name, email, phone
}
