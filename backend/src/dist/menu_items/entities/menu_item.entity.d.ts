import { Restaurant } from "../../restaurant/entities/restaurant.entity";
export declare class MenuItem {
    id: string;
    restaurant_id: string;
    restaurant: Restaurant;
    name: string;
    description: string;
    price: number;
    image: string;
    is_available: boolean;
    preparation_time: number;
}
