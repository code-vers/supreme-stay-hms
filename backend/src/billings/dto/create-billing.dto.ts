// src/billing/dto/create-billing.dto.ts
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { BillingType, PaymentMethod } from '../entities/billing.entity';

export class CreateBillingDto {
  @IsUUID()
  hotel_id: string;

  @IsEnum(BillingType)
  billing_type: BillingType;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsPositive()
  final_amount: number;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ValidateIf((o) => o.billing_type === BillingType.ROOM_BOOKING)
  @IsUUID()
  booking_id?: string;

  @ValidateIf((o) => o.billing_type === BillingType.ROOM_BOOKING)
  @IsUUID()
  room_id?: string;

  @ValidateIf((o) => o.billing_type === BillingType.MENU_ORDER)
  @IsUUID()
  menu_order_id?: string;

  @ValidateIf((o) => o.billing_type === BillingType.TABLE_RESERVATION)
  @IsUUID()
  reservation_id?: string;

  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
