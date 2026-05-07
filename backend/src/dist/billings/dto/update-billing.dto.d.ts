import { BillingStatus, PaymentMethod } from '../entities/billing.entity';
export declare class UpdateBillingDto {
    status?: BillingStatus;
    payment_method?: PaymentMethod;
    transaction_id?: string;
    note?: string;
}
