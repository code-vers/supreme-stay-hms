// src/billing/dto/update-billing.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BillingStatus, PaymentMethod } from '../entities/billing.entity';

export class UpdateBillingDto {
  @IsEnum(BillingStatus)
  @IsOptional()
  status?: BillingStatus;

  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method?: PaymentMethod;

  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
