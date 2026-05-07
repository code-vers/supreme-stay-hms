// src/purchase-item/purchase-item.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { InventoryItem } from 'src/inventory-item/entities/inventory-item.entity';
import { InventoryLog } from 'src/inventory-log/entities/inventory-log.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { PurchaseItemController } from './purchase-item.controller';
import { PurchaseItemService } from './purchase-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseItem,
      InventoryItem,
      InventoryLog,
      Hotel,
    ]),
  ],
  controllers: [PurchaseItemController],
  providers: [PurchaseItemService],
  exports: [PurchaseItemService],
})
export class PurchaseItemModule {}
