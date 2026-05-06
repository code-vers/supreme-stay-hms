// src/menu-item/menu-item.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { MenuItem } from './entities/menu_item.entity';
import { MenuItemController } from './menu_items.controller';
import { MenuItemService } from './menu_items.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, Restaurant])],
  controllers: [MenuItemController],
  providers: [MenuItemService],
})
export class MenuItemModule {}
