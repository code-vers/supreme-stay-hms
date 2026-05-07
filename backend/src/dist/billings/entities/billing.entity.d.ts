import { Booking } from "../../booking/entities/booking.entity";
import { Hotel } from "../../hotels/entities/hotel.entity";
import { MenuOrderItem } from "../../menu-order-item/entities/menu-order-item.entity";
import { Reservation } from "../../restaurant_table_reservation/entities/restaurant_table_reservation.entity";
import { Room } from "../../room/entities/room.entity";
export declare enum BillingType {
    ROOM_BOOKING = "room_booking",
    MENU_ORDER = "menu_order",
    TABLE_RESERVATION = "table_reservation"
}
export declare enum PaymentMethod {
    CASH = "cash",
    CARD = "card",
    ONLINE = "online",
    STRIPE = "stripe"
}
export declare enum BillingStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare class Billing {
    id: string;
    hotel_id: string;
    user_id: string;
    billing_type: BillingType;
    booking_id: string;
    menu_order_id: string;
    reservation_id: string;
    room_id: string;
    amount: number;
    discount: number;
    final_amount: number;
    payment_method: PaymentMethod;
    status: BillingStatus;
    transaction_id: string;
    paid_at: Date;
    note: string;
    hotel: Hotel;
    room: Room;
    booking: Booking;
    menuOrder: MenuOrderItem;
    reservation: Reservation;
    created_at: Date;
    updated_at: Date;
}
