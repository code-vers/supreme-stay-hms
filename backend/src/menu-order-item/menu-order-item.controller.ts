import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuOrderItemService } from './menu-order-item.service';
import { CreateMenuOrderItemDto } from './dto/create-menu-order-item.dto';
import { UpdateMenuOrderItemDto } from './dto/update-menu-order-item.dto';

@Controller('menu-order-item')
export class MenuOrderItemController {
  constructor(private readonly menuOrderItemService: MenuOrderItemService) {}

  @Post()
  create(@Body() createMenuOrderItemDto: CreateMenuOrderItemDto) {
    return this.menuOrderItemService.create(createMenuOrderItemDto);
  }

  @Get()
  findAll() {
    return this.menuOrderItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuOrderItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuOrderItemDto: UpdateMenuOrderItemDto) {
    return this.menuOrderItemService.update(+id, updateMenuOrderItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuOrderItemService.remove(+id);
  }
}
