// src/menu-order-item/dto/update-menu-order-item.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../entities/menu-order-item.entity';

export class UpdateMenuOrderItemDto {
  @IsEnum(PaymentStatus)
  @IsOptional()
  payment_status?: PaymentStatus;

  @IsString()
  @IsOptional()
  note?: string;

  @IsOptional()
  delivery_time?: Date;
}
