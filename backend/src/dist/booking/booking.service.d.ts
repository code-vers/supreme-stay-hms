import { Hotel } from "../hotels/entities/hotel.entity";
import { Room } from "../room/entities/room.entity";
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
export declare class BookingService {
    private readonly bookingRepo;
    private readonly hotelRepo;
    private readonly roomRepo;
    constructor(bookingRepo: Repository<Booking>, hotelRepo: Repository<Hotel>, roomRepo: Repository<Room>);
    private verifyHotelOwner;
    checkRoomAvailability(roomId: string, checkIn: string, checkOut: string, excludeBookingId?: string): Promise<boolean>;
    private calculateBookingAmounts;
    create(dto: CreateBookingDto, userId: string): Promise<Booking>;
    findAll(query: QueryBookingDto): Promise<{
        items: Booking[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Booking>;
    findMyBookings(userId: string, query: QueryBookingDto): Promise<{
        items: Booking[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getRoomAvailability(roomId: string, checkIn: string, checkOut: string): Promise<{
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
    update(id: string, dto: UpdateBookingDto, userId: string): Promise<Booking>;
    cancelBooking(id: string, userId: string, reason?: string): Promise<{
        message: string;
    }>;
    getHotelBookingReport(hotelId: string, userId: string): Promise<{
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
    private validateStatusTransition;
}
