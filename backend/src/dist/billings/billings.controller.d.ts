import { CreateBillingDto } from './dto/create-billing.dto';
import { QueryBillingDto } from './dto/query-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { BillingService } from './billings.service';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    create(dto: CreateBillingDto, userId: string): Promise<import("./entities/billing.entity").Billing>;
    findAll(query: QueryBillingDto): Promise<{
        items: import("./entities/billing.entity").Billing[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMyBillings(userId: string, query: QueryBillingDto): Promise<{
        items: import("./entities/billing.entity").Billing[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getReport(hotelId: string, userId: string): Promise<{
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
    findOne(id: string): Promise<import("./entities/billing.entity").Billing>;
    update(id: string, dto: UpdateBillingDto, userId: string): Promise<import("./entities/billing.entity").Billing>;
}
