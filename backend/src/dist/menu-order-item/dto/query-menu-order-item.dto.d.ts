import { OrderCategory, PaymentStatus } from '../entities/menu-order-item.entity';
export declare class QueryMenuOrderItemDto {
    page?: string;
    limit?: string;
    hotel_id?: string;
    restaurant_id?: string;
    table_id?: string;
    room_id?: string;
    menu_item_id?: string;
    category?: OrderCategory;
    payment_status?: PaymentStatus;
    date_from?: string;
    date_to?: string;
    search?: string;
}
