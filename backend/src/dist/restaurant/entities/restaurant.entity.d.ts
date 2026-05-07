import { Hotel } from "../../hotels/entities/hotel.entity";
import { MenuItem } from "../../menu_items/entities/menu_item.entity";
import { RestaurantTable } from "../../restaurant-table/entities/restaurant-table.entity";
export declare enum RestaurantType {
    RESTAURANT = "restaurant",
    BAR = "bar",
    CAFE = "cafe",
    SPA = "spa"
}
export declare enum RestaurantStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class Restaurant {
    id: string;
    hotel_id: string;
    hotel: Hotel;
    name: string;
    type: RestaurantType;
    status: RestaurantStatus;
    tables: RestaurantTable[];
    menuItems: MenuItem[];
}
