import { OrderType } from '../entities/restaurant_table_reservation.entity';
export declare class CreateReservationDto {
    restaurant_id: string;
    table_id: string;
    order_type: OrderType;
    total_amount: number;
    discount?: number;
    grand_total: number;
    order_by: string;
    reservation_date: string;
    booking_duration_minutes?: number;
    guest_count?: number;
    special_request?: string;
}
