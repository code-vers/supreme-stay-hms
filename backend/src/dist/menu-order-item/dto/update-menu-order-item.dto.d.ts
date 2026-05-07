import { PaymentStatus } from '../entities/menu-order-item.entity';
export declare class UpdateMenuOrderItemDto {
    payment_status?: PaymentStatus;
    note?: string;
    delivery_time?: Date;
}
