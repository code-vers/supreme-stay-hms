// src/menu-item/dto/create-menu-item.dto.ts
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateMenuItemDto {
  @IsUUID()
  @IsNotEmpty()
  restaurant_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsBoolean()
  @IsOptional()
  is_available?: boolean;

  @IsInt()
  @Min(1)
  preparation_time: number;
}
