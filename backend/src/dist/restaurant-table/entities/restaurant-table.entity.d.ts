import { Restaurant } from "../../restaurant/entities/restaurant.entity";
export declare enum RestaurantTableStatus {
    AVAILABLE = "available",
    OCCUPIED = "occupied",
    RESERVED = "reserved"
}
export declare class RestaurantTable {
    id: string;
    restaurant_id: string;
    restaurant: Restaurant;
    table_number: number;
    capacity: number;
    status: RestaurantTableStatus;
}
