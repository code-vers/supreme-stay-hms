// src/reservation/reservation.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { RestaurantTable } from 'src/restaurant-table/entities/restaurant-table.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Reservation } from './entities/restaurant_table_reservation.entity';
import { ReservationController } from './restaurant_table_reservation.controller';
import { ReservationService } from './restaurant_table_reservation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, RestaurantTable, Restaurant, Hotel]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
