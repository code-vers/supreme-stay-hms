import { Restaurant } from "../restaurant/entities/restaurant.entity";
import { Repository } from 'typeorm';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { QueryMenuItemDto } from './dto/query-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { MenuItem } from './entities/menu_item.entity';
export declare class MenuItemService {
    private menuItemRepo;
    private restaurantRepo;
    constructor(menuItemRepo: Repository<MenuItem>, restaurantRepo: Repository<Restaurant>);
    private verifyRestaurantOwner;
    create(createMenuItemDto: CreateMenuItemDto, userId: string): Promise<MenuItem>;
    findAll(restaurantId: string, query: QueryMenuItemDto): Promise<{
        items: MenuItem[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<MenuItem>;
    update(id: string, updateMenuItemDto: UpdateMenuItemDto, userId: string): Promise<MenuItem>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
