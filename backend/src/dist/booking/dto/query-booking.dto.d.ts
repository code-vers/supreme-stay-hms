import { BookingStatus, BookingType, PaymentStatus } from '../entities/booking.entity';
export declare class QueryBookingDto {
    page?: string;
    limit?: string;
    hotel_id?: string;
    room_id?: string;
    user_id?: string;
    booking_status?: BookingStatus;
    payment_status?: PaymentStatus;
    booking_type?: BookingType;
    date_from?: string;
    date_to?: string;
    search?: string;
}
