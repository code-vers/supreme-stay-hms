// src/inventory-log/dto/query-inventory-log.dto.ts
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { LogType } from '../entities/inventory-log.entity';

export class QueryInventoryLogDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() limit?: string;
  @IsOptional() @IsUUID() item_id?: string;
  @IsOptional() @IsUUID() hotel_id?: string;
  @IsOptional() @IsEnum(LogType) type?: LogType;
  @IsOptional() @IsDateString() date_from?: string;
  @IsOptional() @IsDateString() date_to?: string;
}
