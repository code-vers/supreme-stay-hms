import { Repository } from 'typeorm';
import { Hotel } from "../hotels/entities/hotel.entity";
import { Restaurant } from "../restaurant/entities/restaurant.entity";
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { QueryRestaurantTableDto } from './dto/query-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import { RestaurantTable } from './entities/restaurant-table.entity';
export declare class RestaurantTableService {
    private readonly tableRepo;
    private readonly restaurantRepo;
    private readonly hotelRepo;
    constructor(tableRepo: Repository<RestaurantTable>, restaurantRepo: Repository<Restaurant>, hotelRepo: Repository<Hotel>);
    create(dto: CreateRestaurantTableDto, userId: string): Promise<RestaurantTable>;
    findAll(query: QueryRestaurantTableDto): Promise<{
        items: RestaurantTable[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByRestaurantId(restaurantId: string, query: QueryRestaurantTableDto): Promise<{
        items: RestaurantTable[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<RestaurantTable>;
    update(id: string, dto: UpdateRestaurantTableDto, userId: string): Promise<RestaurantTable>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
