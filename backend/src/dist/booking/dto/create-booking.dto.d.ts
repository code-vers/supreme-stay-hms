import { BookingType, PaymentMethod } from '../entities/booking.entity';
export declare class CreateBookingDto {
    guest_name: string;
    email: string;
    phone_number: string;
    id_or_passport_no?: string;
    check_in: string;
    check_out: string;
    adults: number;
    children?: number;
    hotel_id: string;
    room_id: string;
    payment_method: PaymentMethod;
    booking_type: BookingType;
    special_request?: string;
}
