import { Test, TestingModule } from '@nestjs/testing';
import { MenuOrderItemController } from './menu-order-item.controller';
import { MenuOrderItemService } from './menu-order-item.service';

describe('MenuOrderItemController', () => {
  let controller: MenuOrderItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuOrderItemController],
      providers: [MenuOrderItemService],
    }).compile();

    controller = module.get<MenuOrderItemController>(MenuOrderItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
