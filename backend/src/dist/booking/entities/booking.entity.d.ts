import { Hotel } from "../../hotels/entities/hotel.entity";
import { Room } from "../../room/entities/room.entity";
export declare enum BookingType {
    ONLINE = "online",
    WALK_IN = "walk_in"
}
export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CHECKED_IN = "checked_in",
    CHECKED_OUT = "checked_out",
    CANCELLED = "cancelled"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    CASH = "cash",
    CARD = "card",
    ONLINE = "online"
}
export declare class Booking {
    id: string;
    guest_name: string;
    email: string;
    phone_number: string;
    id_or_passport_no: string;
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    room_type: string;
    room_number: number;
    payment_method: PaymentMethod;
    booking_type: BookingType;
    booking_status: BookingStatus;
    payment_status: PaymentStatus;
    special_request: string;
    hotel_id: string;
    user_id: string;
    room_id: string;
    total_nights: number;
    total_amount: number;
    cancellation_reason: string;
    cancelled_at: Date;
    hotel: Hotel;
    room: Room;
    created_at: Date;
    updated_at: Date;
}
