// src/booking/dto/update-booking.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
} from '../entities/booking.entity';

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  @IsOptional()
  booking_status?: BookingStatus;

  @IsEnum(PaymentStatus)
  @IsOptional()
  payment_status?: PaymentStatus;

  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method?: PaymentMethod;

  @IsString()
  @IsOptional()
  special_request?: string;

  @IsString()
  @IsOptional()
  cancellation_reason?: string;
}
