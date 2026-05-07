import { BillingStatus, BillingType, PaymentMethod } from '../entities/billing.entity';
export declare class QueryBillingDto {
    page?: string;
    limit?: string;
    hotel_id?: string;
    user_id?: string;
    room_id?: string;
    billing_type?: BillingType;
    status?: BillingStatus;
    payment_method?: PaymentMethod;
    date_from?: string;
    date_to?: string;
    search?: string;
}
