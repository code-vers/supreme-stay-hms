import { BookingStatus, PaymentMethod, PaymentStatus } from '../entities/booking.entity';
export declare class UpdateBookingDto {
    booking_status?: BookingStatus;
    payment_status?: PaymentStatus;
    payment_method?: PaymentMethod;
    special_request?: string;
    cancellation_reason?: string;
}
