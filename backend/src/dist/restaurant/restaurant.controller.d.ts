import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { QueryRestaurantDto } from './dto/query-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
export declare class RestaurantController {
    private readonly restaurantService;
    constructor(restaurantService: RestaurantService);
    create(createRestaurantDto: CreateRestaurantDto, userId: string): Promise<import("./entities/restaurant.entity").Restaurant>;
    findAll(query: QueryRestaurantDto): Promise<{
        items: import("./entities/restaurant.entity").Restaurant[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/restaurant.entity").Restaurant>;
    update(id: string, updateRestaurantDto: UpdateRestaurantDto, userId: string): Promise<import("./entities/restaurant.entity").Restaurant>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
