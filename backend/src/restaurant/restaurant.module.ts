import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { Restaurant } from './entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Hotel])],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
