// src/billing/billing.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { MenuOrderItem } from 'src/menu-order-item/entities/menu-order-item.entity';

import { Room } from 'src/room/entities/room.entity';

import { Billing } from './entities/billing.entity';
import { Reservation } from 'src/restaurant_table_reservation/entities/restaurant_table_reservation.entity';
import { BillingController } from './billings.controller';
import { BillingService } from './billings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Billing,
      Hotel,
      Room,
      Booking,
      MenuOrderItem,
      Reservation,
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
