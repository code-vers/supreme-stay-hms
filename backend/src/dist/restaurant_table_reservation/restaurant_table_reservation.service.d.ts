import { Hotel } from "../hotels/entities/hotel.entity";
import { RestaurantTable, RestaurantTableStatus } from "../restaurant-table/entities/restaurant-table.entity";
import { Restaurant } from "../restaurant/entities/restaurant.entity";
import { Repository } from 'typeorm';
import { QueryReservationDto } from './dto/query-reservation.dto';
import { CreateReservationDto } from './dto/create-restaurant_table_reservation.dto';
import { UpdateReservationDto } from './dto/update-restaurant_table_reservation.dto';
import { Reservation } from './entities/restaurant_table_reservation.entity';
export declare class ReservationService {
    private readonly reservationRepo;
    private readonly tableRepo;
    private readonly restaurantRepo;
    private readonly hotelRepo;
    constructor(reservationRepo: Repository<Reservation>, tableRepo: Repository<RestaurantTable>, restaurantRepo: Repository<Restaurant>, hotelRepo: Repository<Hotel>);
    private verifyHotelOwner;
    checkTableAvailability(tableId: string, reservationDate: Date, bookingDurationMinutes?: number): Promise<boolean>;
    create(dto: CreateReservationDto, userId: string): Promise<Reservation>;
    findAll(query: QueryReservationDto): Promise<{
        items: Reservation[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Reservation>;
    findMyReservations(userId: string, query: QueryReservationDto): Promise<{
        items: Reservation[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateStatus(id: string, dto: UpdateReservationDto, userId: string): Promise<Reservation>;
    cancelReservation(id: string, userId: string): Promise<{
        message: string;
    }>;
    getTableAvailability(tableId: string, date: string, bookingDurationMinutes?: number): Promise<{
        table_id: string;
        table_number: number;
        capacity: number;
        current_status: RestaurantTableStatus;
        is_available_on_slot: boolean;
        checked_date: string;
        booking_duration_minutes: number;
    }>;
    getRestaurantReport(restaurantId: string, userId: string): Promise<{
        summary: {
            total_reservations: number;
            total_revenue: number;
            total_discount: number;
            today_reservations: number;
            status_breakdown: Record<string, number>;
        };
        table_report: any[];
    }>;
    private validateStatusTransition;
}
