import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantTableReservationController } from './restaurant_table_reservation.controller';
import { RestaurantTableReservationService } from './restaurant_table_reservation.service';

describe('RestaurantTableReservationController', () => {
  let controller: RestaurantTableReservationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantTableReservationController],
      providers: [RestaurantTableReservationService],
    }).compile();

    controller = module.get<RestaurantTableReservationController>(RestaurantTableReservationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
