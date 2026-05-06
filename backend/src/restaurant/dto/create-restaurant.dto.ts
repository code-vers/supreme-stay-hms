import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import {
  RestaurantStatus,
  RestaurantType,
} from '../entities/restaurant.entity';

export class CreateRestaurantDto {
  @IsUUID()
  hotel_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RestaurantType)
  type: RestaurantType;

  @IsEnum(RestaurantStatus)
  status: RestaurantStatus;
}
