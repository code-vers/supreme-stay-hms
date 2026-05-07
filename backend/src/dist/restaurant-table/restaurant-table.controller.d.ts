import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { QueryRestaurantTableDto } from './dto/query-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import { RestaurantTableService } from './restaurant-table.service';
export declare class RestaurantTableController {
    private readonly restaurantTableService;
    constructor(restaurantTableService: RestaurantTableService);
    create(createRestaurantTableDto: CreateRestaurantTableDto, userId: string): Promise<import("./entities/restaurant-table.entity").RestaurantTable>;
    findAll(query: QueryRestaurantTableDto): Promise<{
        items: import("./entities/restaurant-table.entity").RestaurantTable[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByRestaurant(restaurantId: string, query: QueryRestaurantTableDto): Promise<{
        items: import("./entities/restaurant-table.entity").RestaurantTable[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/restaurant-table.entity").RestaurantTable>;
    update(id: string, updateRestaurantTableDto: UpdateRestaurantTableDto, userId: string): Promise<import("./entities/restaurant-table.entity").RestaurantTable>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
