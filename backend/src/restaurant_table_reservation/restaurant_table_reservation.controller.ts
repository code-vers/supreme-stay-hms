import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RestaurantTableReservationService } from './restaurant_table_reservation.service';
import { CreateRestaurantTableReservationDto } from './dto/create-restaurant_table_reservation.dto';
import { UpdateRestaurantTableReservationDto } from './dto/update-restaurant_table_reservation.dto';

@Controller('restaurant-table-reservation')
export class RestaurantTableReservationController {
  constructor(private readonly restaurantTableReservationService: RestaurantTableReservationService) {}

  @Post()
  create(@Body() createRestaurantTableReservationDto: CreateRestaurantTableReservationDto) {
    return this.restaurantTableReservationService.create(createRestaurantTableReservationDto);
  }

  @Get()
  findAll() {
    return this.restaurantTableReservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantTableReservationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestaurantTableReservationDto: UpdateRestaurantTableReservationDto) {
    return this.restaurantTableReservationService.update(+id, updateRestaurantTableReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantTableReservationService.remove(+id);
  }
}
