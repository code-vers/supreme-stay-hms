// src/purchase-item/purchase-item.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user.role.enun';
import { CreatePurchaseItemDto } from './dto/create-purchase-item.dto';
import { QueryPurchaseItemDto } from './dto/query-purchase-item.dto';
import { UpdatePurchaseItemDto } from './dto/update-purchase-item.dto';
import { PurchaseItemService } from './purchase-item.service';

@Controller('purchase-items')
export class PurchaseItemController {
  constructor(private readonly purchaseItemService: PurchaseItemService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Post()
  create(
    @Body() dto: CreatePurchaseItemDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.purchaseItemService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get()
  findAll(@Query() query: QueryPurchaseItemDto) {
    return this.purchaseItemService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get('report/:hotelId')
  getReport(
    @Param('hotelId') hotelId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.purchaseItemService.getPurchaseReport(hotelId, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseItemService.findOne(id);
  }

  // Status update — RECEIVED হলে stock auto-update
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePurchaseItemDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.purchaseItemService.updateStatus(id, dto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.purchaseItemService.remove(id, userId);
  }
}
