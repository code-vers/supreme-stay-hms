// src/purchase-item/dto/query-purchase-item.dto.ts
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PurchaseStatus } from '../entities/purchase-item.entity';

export class QueryPurchaseItemDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() limit?: string;
  @IsOptional() @IsUUID() hotel_id?: string;
  @IsOptional() @IsUUID() item_id?: string;
  @IsOptional() @IsUUID() supplier_id?: string;
  @IsOptional() @IsEnum(PurchaseStatus) status?: PurchaseStatus;
  @IsOptional() @IsDateString() date_from?: string;
  @IsOptional() @IsDateString() date_to?: string;
}
