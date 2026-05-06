import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantTableReservationService } from './restaurant_table_reservation.service';

describe('RestaurantTableReservationService', () => {
  let service: RestaurantTableReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantTableReservationService],
    }).compile();

    service = module.get<RestaurantTableReservationService>(RestaurantTableReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
