// src/inventory-item/dto/update-inventory-item.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryItemDto } from './create-inventory-item.dto';
export class UpdateInventoryItemDto extends PartialType(
  CreateInventoryItemDto,
) {}
