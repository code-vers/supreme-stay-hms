import { CreateReservationDto } from './dto/create-restaurant_table_reservation.dto';
import { QueryReservationDto } from './dto/query-reservation.dto';
import { UpdateReservationDto } from './dto/update-restaurant_table_reservation.dto';
import { ReservationService } from './restaurant_table_reservation.service';
export declare class ReservationController {
    private readonly reservationService;
    constructor(reservationService: ReservationService);
    create(dto: CreateReservationDto, userId: string): Promise<import("./entities/restaurant_table_reservation.entity").Reservation>;
    findAll(query: QueryReservationDto): Promise<{
        items: import("./entities/restaurant_table_reservation.entity").Reservation[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMyReservations(userId: string, query: QueryReservationDto): Promise<{
        items: import("./entities/restaurant_table_reservation.entity").Reservation[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    checkAvailability(tableId: string, date: string, durationMinutes?: string): Promise<{
        table_id: string;
        table_number: number;
        capacity: number;
        current_status: import("../restaurant-table/entities/restaurant-table.entity").RestaurantTableStatus;
        is_available_on_slot: boolean;
        checked_date: string;
        booking_duration_minutes: number;
    }>;
    getReport(restaurantId: string, userId: string): Promise<{
        summary: {
            total_reservations: number;
            total_revenue: number;
            total_discount: number;
            today_reservations: number;
            status_breakdown: Record<string, number>;
        };
        table_report: any[];
    }>;
    findOne(id: string): Promise<import("./entities/restaurant_table_reservation.entity").Reservation>;
    updateStatus(id: string, dto: UpdateReservationDto, userId: string): Promise<import("./entities/restaurant_table_reservation.entity").Reservation>;
    cancel(id: string, userId: string): Promise<{
        message: string;
    }>;
}
