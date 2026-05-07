import { BillingType, PaymentMethod } from '../entities/billing.entity';
export declare class CreateBillingDto {
    hotel_id: string;
    billing_type: BillingType;
    amount: number;
    discount?: number;
    final_amount: number;
    payment_method: PaymentMethod;
    booking_id?: string;
    room_id?: string;
    menu_order_id?: string;
    reservation_id?: string;
    transaction_id?: string;
    note?: string;
}
