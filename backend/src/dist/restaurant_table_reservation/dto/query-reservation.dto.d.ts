import { OrderType, ReservationStatus } from '../entities/restaurant_table_reservation.entity';
export declare class QueryReservationDto {
    page?: string;
    limit?: string;
    restaurant_id?: string;
    table_id?: string;
    user_id?: string;
    status?: ReservationStatus;
    order_type?: OrderType;
    date_from?: string;
    date_to?: string;
    search?: string;
}
