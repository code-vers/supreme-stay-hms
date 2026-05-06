// src/booking/booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Room } from 'src/room/entities/room.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Hotel, Room])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
