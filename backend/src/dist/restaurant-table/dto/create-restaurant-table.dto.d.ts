import { RestaurantTableStatus } from '../entities/restaurant-table.entity';
export declare class CreateRestaurantTableDto {
    restaurant_id: string;
    table_number: number;
    capacity: number;
    status: RestaurantTableStatus;
}
