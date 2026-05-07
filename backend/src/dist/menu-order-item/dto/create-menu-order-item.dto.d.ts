import { OrderCategory } from '../entities/menu-order-item.entity';
export declare class CreateMenuOrderItemDto {
    hotel_id: string;
    restaurant_id: string;
    menu_item_id: string;
    category: OrderCategory;
    table_id?: string;
    room_id?: string;
    quantity: number;
    price: number;
    subtotal: number;
    note?: string;
    delivery_time?: Date;
}
