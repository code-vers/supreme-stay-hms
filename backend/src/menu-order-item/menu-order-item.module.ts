import { Module } from '@nestjs/common';
import { MenuOrderItemService } from './menu-order-item.service';
import { MenuOrderItemController } from './menu-order-item.controller';

@Module({
  controllers: [MenuOrderItemController],
  providers: [MenuOrderItemService],
})
export class MenuOrderItemModule {}
