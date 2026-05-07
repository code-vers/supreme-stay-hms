import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create(dto: CreateBookingDto, userId: string): Promise<import("./entities/booking.entity").Booking>;
    findAll(query: QueryBookingDto): Promise<{
        items: import("./entities/booking.entity").Booking[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMyBookings(userId: string, query: QueryBookingDto): Promise<{
        items: import("./entities/booking.entity").Booking[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    checkAvailability(roomId: string, checkIn: string, checkOut: string): Promise<{
        room_id: string;
        room_number: number;
        room_type: string;
        price_per_night: number;
        is_available: boolean;
        checked_range: {
            check_in: string;
            check_out: string;
        };
        blocked_dates: {
            check_in: string;
            check_out: string;
        }[];
    }>;
    getReport(hotelId: string, userId: string): Promise<{
        summary: {
            total_revenue: number;
            total_bookings: number;
            avg_nights: string;
            today_check_ins: number;
            today_check_outs: number;
        };
        status_breakdown: any[];
        type_breakdown: any[];
        room_occupancy: any[];
        monthly_revenue: any[];
    }>;
    findOne(id: string): Promise<import("./entities/booking.entity").Booking>;
    update(id: string, dto: UpdateBookingDto, userId: string): Promise<import("./entities/booking.entity").Booking>;
    cancel(id: string, userId: string, reason?: string): Promise<{
        message: string;
    }>;
}
