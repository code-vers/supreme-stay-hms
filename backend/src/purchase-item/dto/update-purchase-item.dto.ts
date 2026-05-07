// src/purchase-item/dto/update-purchase-item.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PurchaseStatus } from '../entities/purchase-item.entity';

export class UpdatePurchaseItemDto {
  @IsEnum(PurchaseStatus)
  @IsOptional()
  status?: PurchaseStatus;

  @IsString()
  @IsOptional()
  note?: string;
}
