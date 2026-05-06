import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantTableReservationDto } from './create-restaurant_table_reservation.dto';

export class UpdateRestaurantTableReservationDto extends PartialType(CreateRestaurantTableReservationDto) {}
