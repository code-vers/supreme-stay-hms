// src/inventory-log/inventory-log.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user.role.enun';
import { CreateInventoryLogDto } from './dto/create-inventory-log.dto';
import { QueryInventoryLogDto } from './dto/query-inventory-log.dto';
import { InventoryLogService } from './inventory-log.service';

@Controller('inventory-logs')
export class InventoryLogController {
  constructor(private readonly inventoryLogService: InventoryLogService) {}

  // Manual log entry (usage, wastage, adjustment)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Post()
  create(
    @Body() dto: CreateInventoryLogDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.inventoryLogService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get()
  findAll(@Query() query: QueryInventoryLogDto) {
    return this.inventoryLogService.findAll(query);
  }

  // Item এর full stock history
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get('history/:itemId')
  getHistory(
    @Param('itemId') itemId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.inventoryLogService.getItemHistory(itemId, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryLogService.findOne(id);
  }
}
