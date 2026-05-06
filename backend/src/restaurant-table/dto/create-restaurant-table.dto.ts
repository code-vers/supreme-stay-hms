import { IsEnum, IsInt, IsUUID, Min } from 'class-validator';
import { RestaurantTableStatus } from '../entities/restaurant-table.entity';

export class CreateRestaurantTableDto {
  @IsUUID()
  restaurant_id: string;

  @IsInt()
  @Min(1)
  table_number: number;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsEnum(RestaurantTableStatus)
  status: RestaurantTableStatus;
}
