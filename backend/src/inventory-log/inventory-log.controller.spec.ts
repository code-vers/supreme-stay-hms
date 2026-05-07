import { Test, TestingModule } from '@nestjs/testing';
import { InventoryLogController } from './inventory-log.controller';
import { InventoryLogService } from './inventory-log.service';

describe('InventoryLogController', () => {
  let controller: InventoryLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryLogController],
      providers: [InventoryLogService],
    }).compile();

    controller = module.get<InventoryLogController>(InventoryLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
