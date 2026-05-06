// src/menu-order-item/menu-order-item.controller.ts
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
import { CreateMenuOrderItemDto } from './dto/create-menu-order-item.dto';
import { QueryMenuOrderItemDto } from './dto/query-menu-order-item.dto';
import { UpdateMenuOrderItemDto } from './dto/update-menu-order-item.dto';
import { MenuOrderItemService } from './menu-order-item.service';

@Controller('menu-orders')
export class MenuOrderItemController {
  constructor(private readonly menuOrderItemService: MenuOrderItemService) {}

  // ── User / Guest: Order place  ─────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateMenuOrderItemDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.menuOrderItemService.create(dto, userId);
  }

  // ── Owner:  ────────────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get()
  findAll(@Query() query: QueryMenuOrderItemDto) {
    return this.menuOrderItemService.findAll(query);
  }

  // ── Owner: Hotel-wide report ────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get('report/hotel/:hotelId')
  hotelReport(
    @Param('hotelId') hotelId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.menuOrderItemService.getHotelOrderReport(hotelId, userId);
  }

  //todo:testing.............
  // ── Owner: Restaurant-specific report ─────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get('report/restaurant/:restaurantId')
  restaurantReport(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.menuOrderItemService.getRestaurantOrderReport(
      restaurantId,
      userId,
    );
  }

  // ── Single order ─────────────────
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuOrderItemService.findOne(id);
  }

  // ── Owner: Payment status / delivery time update ────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMenuOrderItemDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.menuOrderItemService.update(id, dto, userId);
  }

  // ── Owner: Order delete (unpaid only) ──────────────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.menuOrderItemService.remove(id, userId);
  }
}
