import { CreateMenuOrderItemDto } from './dto/create-menu-order-item.dto';
import { QueryMenuOrderItemDto } from './dto/query-menu-order-item.dto';
import { UpdateMenuOrderItemDto } from './dto/update-menu-order-item.dto';
import { MenuOrderItemService } from './menu-order-item.service';
export declare class MenuOrderItemController {
    private readonly menuOrderItemService;
    constructor(menuOrderItemService: MenuOrderItemService);
    create(dto: CreateMenuOrderItemDto, userId: string): Promise<import("./entities/menu-order-item.entity").MenuOrderItem>;
    findAll(query: QueryMenuOrderItemDto): Promise<{
        items: import("./entities/menu-order-item.entity").MenuOrderItem[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    hotelReport(hotelId: string, userId: string): Promise<{
        summary: {
            total_revenue: number;
            today_orders: number;
            today_revenue: number;
        };
        category_breakdown: any[];
        payment_breakdown: any[];
        top_menu_items: any[];
        restaurant_breakdown: any[];
    }>;
    restaurantReport(restaurantId: string, userId: string): Promise<{
        total_orders: number;
        paid_orders: number;
        pending_orders: number;
        total_revenue: number;
        dine_in_orders: number;
        room_service_orders: number;
        takeaway_orders: number;
    }>;
    findOne(id: string): Promise<import("./entities/menu-order-item.entity").MenuOrderItem>;
    update(id: string, dto: UpdateMenuOrderItemDto, userId: string): Promise<import("./entities/menu-order-item.entity").MenuOrderItem>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
