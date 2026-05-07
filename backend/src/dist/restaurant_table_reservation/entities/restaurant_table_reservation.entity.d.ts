import { RestaurantTable } from "../../restaurant-table/entities/restaurant-table.entity";
import { Restaurant } from "../../restaurant/entities/restaurant.entity";
export declare enum OrderType {
    DINE_IN = "dine_in",
    TAKEAWAY = "takeaway",
    ROOM_SERVICE = "room_service"
}
export declare enum ReservationStatus {
    PENDING = "pending",
    COOKING = "cooking",
    SERVED = "served",
    PAID = "paid",
    CANCELLED = "cancelled"
}
export declare class Reservation {
    id: string;
    user_id: string;
    restaurant_id: string;
    table_id: string;
    order_type: OrderType;
    status: ReservationStatus;
    total_amount: number;
    discount: number;
    grand_total: number;
    order_by: string;
    reservation_date: Date;
    check_in_time: Date;
    check_out_time: Date;
    booking_duration_minutes: number;
    special_request: string;
    guest_count: number;
    restaurant: Restaurant;
    table: RestaurantTable;
    created_at: Date;
    updated_at: Date;
}
