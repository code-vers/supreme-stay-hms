import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuOrderItemDto } from './create-menu-order-item.dto';

export class UpdateMenuOrderItemDto extends PartialType(CreateMenuOrderItemDto) {}
