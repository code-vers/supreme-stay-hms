import { Hotel } from "../../hotels/entities/hotel.entity";
import { MenuItem } from "../../menu_items/entities/menu_item.entity";
import { RestaurantTable } from "../../restaurant-table/entities/restaurant-table.entity";
import { Restaurant } from "../../restaurant/entities/restaurant.entity";
import { Room } from "../../room/entities/room.entity";
export declare enum OrderCategory {
    DINE_IN = "dine_in",
    ROOM_SERVICE = "room_service",
    TAKEAWAY = "takeaway"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}
export declare class MenuOrderItem {
    id: string;
    hotel_id: string;
    table_id: string;
    room_id: string;
    restaurant_id: string;
    menu_item_id: string;
    quantity: number;
    price: number;
    subtotal: number;
    note: string;
    payment_status: PaymentStatus;
    category: OrderCategory;
    delivery_time: Date;
    hotel: Hotel;
    table: RestaurantTable;
    room: Room;
    restaurant: Restaurant;
    menuItem: MenuItem;
    created_at: Date;
    updated_at: Date;
}
