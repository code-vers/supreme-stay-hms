// src/booking/dto/create-booking.dto.ts
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { BookingType, PaymentMethod } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  guest_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsOptional()
  id_or_passport_no?: string;

  @IsDateString()
  check_in: string;

  @IsDateString()
  check_out: string;

  @IsInt()
  @Min(1)
  adults: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  children?: number;

  @IsUUID()
  hotel_id: string;

  @IsUUID()
  room_id: string;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @IsEnum(BookingType)
  booking_type: BookingType;

  @IsString()
  @IsOptional()
  special_request?: string;
}
