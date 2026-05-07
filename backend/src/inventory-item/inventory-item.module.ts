import { Module } from '@nestjs/common';
import { InventoryItemService } from './inventory-item.service';
import { InventoryItemController } from './inventory-item.controller';

@Module({
  controllers: [InventoryItemController],
  providers: [InventoryItemService],
})
export class InventoryItemModule {}
