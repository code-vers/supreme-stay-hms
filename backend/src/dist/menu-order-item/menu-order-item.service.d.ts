import { Hotel } from "../hotels/entities/hotel.entity";
import { MenuItem } from "../menu_items/entities/menu_item.entity";
import { RestaurantTable } from "../restaurant-table/entities/restaurant-table.entity";
import { Restaurant } from "../restaurant/entities/restaurant.entity";
import { Room } from "../room/entities/room.entity";
import { Repository } from 'typeorm';
import { CreateMenuOrderItemDto } from './dto/create-menu-order-item.dto';
import { QueryMenuOrderItemDto } from './dto/query-menu-order-item.dto';
import { UpdateMenuOrderItemDto } from './dto/update-menu-order-item.dto';
import { MenuOrderItem } from './entities/menu-order-item.entity';
export declare class MenuOrderItemService {
    private readonly orderRepo;
    private readonly hotelRepo;
    private readonly restaurantRepo;
    private readonly tableRepo;
    private readonly roomRepo;
    private readonly menuItemRepo;
    constructor(orderRepo: Repository<MenuOrderItem>, hotelRepo: Repository<Hotel>, restaurantRepo: Repository<Restaurant>, tableRepo: Repository<RestaurantTable>, roomRepo: Repository<Room>, menuItemRepo: Repository<MenuItem>);
    private verifyHotelOwner;
    private validateOrderContext;
    create(dto: CreateMenuOrderItemDto, userId: string): Promise<MenuOrderItem>;
    findAll(query: QueryMenuOrderItemDto): Promise<{
        items: MenuOrderItem[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<MenuOrderItem>;
    findMyOrders(userId: string, query: QueryMenuOrderItemDto): Promise<{
        items: MenuOrderItem[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(id: string, dto: UpdateMenuOrderItemDto, userId: string): Promise<MenuOrderItem>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    getHotelOrderReport(hotelId: string, userId: string): Promise<{
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
    getRestaurantOrderReport(restaurantId: string, userId: string): Promise<{
        total_orders: number;
        paid_orders: number;
        pending_orders: number;
        total_revenue: number;
        dine_in_orders: number;
        room_service_orders: number;
        takeaway_orders: number;
    }>;
}
