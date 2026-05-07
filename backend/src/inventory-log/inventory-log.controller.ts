import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryLogService } from './inventory-log.service';
import { CreateInventoryLogDto } from './dto/create-inventory-log.dto';
import { UpdateInventoryLogDto } from './dto/update-inventory-log.dto';

@Controller('inventory-log')
export class InventoryLogController {
  constructor(private readonly inventoryLogService: InventoryLogService) {}

  @Post()
  create(@Body() createInventoryLogDto: CreateInventoryLogDto) {
    return this.inventoryLogService.create(createInventoryLogDto);
  }

  @Get()
  findAll() {
    return this.inventoryLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventoryLogDto: UpdateInventoryLogDto) {
    return this.inventoryLogService.update(+id, updateInventoryLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryLogService.remove(+id);
  }
}
