import { Injectable } from '@nestjs/common';
import { CreateRestaurantTableReservationDto } from './dto/create-restaurant_table_reservation.dto';
import { UpdateRestaurantTableReservationDto } from './dto/update-restaurant_table_reservation.dto';

@Injectable()
export class RestaurantTableReservationService {
  create(createRestaurantTableReservationDto: CreateRestaurantTableReservationDto) {
    return 'This action adds a new restaurantTableReservation';
  }

  findAll() {
    return `This action returns all restaurantTableReservation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurantTableReservation`;
  }

  update(id: number, updateRestaurantTableReservationDto: UpdateRestaurantTableReservationDto) {
    return `This action updates a #${id} restaurantTableReservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurantTableReservation`;
  }
}
