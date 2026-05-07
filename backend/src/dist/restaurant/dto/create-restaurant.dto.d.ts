import { RestaurantStatus, RestaurantType } from '../entities/restaurant.entity';
export declare class CreateRestaurantDto {
    hotel_id: string;
    name: string;
    type: RestaurantType;
    status: RestaurantStatus;
}
