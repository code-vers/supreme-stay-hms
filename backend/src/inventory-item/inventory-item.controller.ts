import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryItemService } from './inventory-item.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@Controller('inventory-item')
export class InventoryItemController {
  constructor(private readonly inventoryItemService: InventoryItemService) {}

  @Post()
  create(@Body() createInventoryItemDto: CreateInventoryItemDto) {
    return this.inventoryItemService.create(createInventoryItemDto);
  }

  @Get()
  findAll() {
    return this.inventoryItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventoryItemDto: UpdateInventoryItemDto) {
    return this.inventoryItemService.update(+id, updateInventoryItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryItemService.remove(+id);
  }
}
