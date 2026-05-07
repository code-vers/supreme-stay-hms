import { ReservationStatus } from '../entities/restaurant_table_reservation.entity';
export declare class UpdateReservationDto {
    status?: ReservationStatus;
    special_request?: string;
    guest_count?: number;
    check_in_time?: Date;
    check_out_time?: Date;
}
