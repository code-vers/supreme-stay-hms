import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { QueryMenuItemDto } from './dto/query-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { MenuItemService } from './menu_items.service';
export declare class MenuItemController {
    private readonly menuItemService;
    constructor(menuItemService: MenuItemService);
    create(restaurantId: string, createMenuItemDto: CreateMenuItemDto, userId: string): Promise<import("./entities/menu_item.entity").MenuItem>;
    findAll(restaurantId: string, query: QueryMenuItemDto): Promise<{
        items: import("./entities/menu_item.entity").MenuItem[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/menu_item.entity").MenuItem>;
    update(id: string, updateMenuItemDto: UpdateMenuItemDto, userId: string): Promise<import("./entities/menu_item.entity").MenuItem>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
