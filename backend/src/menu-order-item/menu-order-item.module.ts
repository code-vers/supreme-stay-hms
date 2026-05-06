// src/menu-order-item/menu-order-item.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';

import { RestaurantTable } from 'src/restaurant-table/entities/restaurant-table.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Room } from 'src/room/entities/room.entity';
import { MenuOrderItem } from './entities/menu-order-item.entity';
import { MenuOrderItemController } from './menu-order-item.controller';
import { MenuOrderItemService } from './menu-order-item.service';
import { MenuItem } from 'src/menu_items/entities/menu_item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MenuOrderItem,
      Hotel,
      Room,
      Restaurant,
      RestaurantTable,
      MenuItem,
    ]),
  ],
  controllers: [MenuOrderItemController],
  providers: [MenuOrderItemService],
})
export class MenuOrderItemModule {}
