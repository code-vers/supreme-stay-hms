// src/inventory-log/dto/create-inventory-log.dto.ts
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { LogType } from '../entities/inventory-log.entity';

export class CreateInventoryLogDto {
  @IsUUID()
  item_id: string;

  @IsEnum(LogType)
  type: LogType;

  // Positive বা Negative — usage/wastage এ negative
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  reference_id?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
