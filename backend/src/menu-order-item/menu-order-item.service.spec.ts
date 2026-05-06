import { Test, TestingModule } from '@nestjs/testing';
import { MenuOrderItemService } from './menu-order-item.service';

describe('MenuOrderItemService', () => {
  let service: MenuOrderItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuOrderItemService],
    }).compile();

    service = module.get<MenuOrderItemService>(MenuOrderItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
