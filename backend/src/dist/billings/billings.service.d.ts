import { Booking } from "../booking/entities/booking.entity";
import { Hotel } from "../hotels/entities/hotel.entity";
import { MenuOrderItem } from "../menu-order-item/entities/menu-order-item.entity";
import { Reservation } from "../restaurant_table_reservation/entities/restaurant_table_reservation.entity";
import { Room } from "../room/entities/room.entity";
import { Repository } from 'typeorm';
import { CreateBillingDto } from './dto/create-billing.dto';
import { QueryBillingDto } from './dto/query-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { Billing } from './entities/billing.entity';
export declare class BillingService {
    private readonly billingRepo;
    private readonly hotelRepo;
    private readonly roomRepo;
    private readonly bookingRepo;
    private readonly menuOrderRepo;
    private readonly reservationRepo;
    constructor(billingRepo: Repository<Billing>, hotelRepo: Repository<Hotel>, roomRepo: Repository<Room>, bookingRepo: Repository<Booking>, menuOrderRepo: Repository<MenuOrderItem>, reservationRepo: Repository<Reservation>);
    private verifyHotelOwner;
    private validateBillingContext;
    private syncPaymentStatus;
    create(dto: CreateBillingDto, userId: string): Promise<Billing>;
    findAll(query: QueryBillingDto): Promise<{
        items: Billing[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Billing>;
    findMyBillings(userId: string, query: QueryBillingDto): Promise<{
        items: Billing[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(id: string, dto: UpdateBillingDto, userId: string): Promise<Billing>;
    getHotelBillingReport(hotelId: string, userId: string): Promise<{
        summary: {
            total_bills: number;
            total_revenue: number;
            total_discount: number;
            today_count: number;
            today_revenue: number;
        };
        type_breakdown: any[];
        method_breakdown: any[];
        status_breakdown: any[];
        monthly_revenue: any[];
    }>;
}
