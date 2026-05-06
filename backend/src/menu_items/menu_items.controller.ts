// src/menu-item/menu-item.controller.ts
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

import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { QueryMenuItemDto } from './dto/query-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { MenuItemService } from './menu_items.service';

// Nested route: /restaurants/:restaurantId/menu-items
@Controller('restaurants/:restaurantId/menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Post()
  create(
    @Param('restaurantId') restaurantId: string,
    @Body() createMenuItemDto: CreateMenuItemDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.menuItemService.create(
      { ...createMenuItemDto, restaurant_id: restaurantId },
      userId,
    );
  }

  @Get()
  findAll(
    @Param('restaurantId') restaurantId: string,
    @Query() query: QueryMenuItemDto,
  ) {
    return this.menuItemService.findAll(restaurantId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.menuItemService.update(id, updateMenuItemDto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.menuItemService.remove(id, userId);
  }
}
