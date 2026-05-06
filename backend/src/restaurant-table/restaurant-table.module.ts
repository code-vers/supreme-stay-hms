import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { RestaurantTableController } from './restaurant-table.controller';
import { RestaurantTableService } from './restaurant-table.service';
import { RestaurantTable } from './entities/restaurant-table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantTable, Restaurant, Hotel])],
  controllers: [RestaurantTableController],
  providers: [RestaurantTableService],
})
export class RestaurantTableModule {}
