// src/inventory-log/inventory-log.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { InventoryItem } from 'src/inventory-item/entities/inventory-item.entity';
import { InventoryLog } from './entities/inventory-log.entity';
import { InventoryLogController } from './inventory-log.controller';
import { InventoryLogService } from './inventory-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryLog, InventoryItem, Hotel])],
  controllers: [InventoryLogController],
  providers: [InventoryLogService],
  exports: [InventoryLogService],
})
export class InventoryLogModule {}
