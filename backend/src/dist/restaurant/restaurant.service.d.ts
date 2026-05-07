import { Repository } from 'typeorm';
import { Hotel } from "../hotels/entities/hotel.entity";
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { QueryRestaurantDto } from './dto/query-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
export declare class RestaurantService {
    private readonly restaurantRepo;
    private readonly hotelRepo;
    constructor(restaurantRepo: Repository<Restaurant>, hotelRepo: Repository<Hotel>);
    create(createRestaurantDto: CreateRestaurantDto, userId: string): Promise<Restaurant>;
    findAll(query: QueryRestaurantDto): Promise<{
        items: Restaurant[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Restaurant>;
    update(id: string, updateRestaurantDto: UpdateRestaurantDto, userId: string): Promise<Restaurant>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
