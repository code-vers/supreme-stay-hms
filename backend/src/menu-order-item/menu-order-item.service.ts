import { Injectable } from '@nestjs/common';
import { CreateMenuOrderItemDto } from './dto/create-menu-order-item.dto';
import { UpdateMenuOrderItemDto } from './dto/update-menu-order-item.dto';

@Injectable()
export class MenuOrderItemService {
  create(createMenuOrderItemDto: CreateMenuOrderItemDto) {
    return 'This action adds a new menuOrderItem';
  }

  findAll() {
    return `This action returns all menuOrderItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menuOrderItem`;
  }

  update(id: number, updateMenuOrderItemDto: UpdateMenuOrderItemDto) {
    return `This action updates a #${id} menuOrderItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuOrderItem`;
  }
}
