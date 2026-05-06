import { Module } from '@nestjs/common';
import { RestaurantTableReservationService } from './restaurant_table_reservation.service';
import { RestaurantTableReservationController } from './restaurant_table_reservation.controller';

@Module({
  controllers: [RestaurantTableReservationController],
  providers: [RestaurantTableReservationService],
})
export class RestaurantTableReservationModule {}
