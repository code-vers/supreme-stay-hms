import { Repository } from 'typeorm';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { QueryHotelsDto } from './dto/query-hotels.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel } from './entities/hotel.entity';
export declare class HotelsService {
    private hotelRepo;
    constructor(hotelRepo: Repository<Hotel>);
    create(createHotelDto: CreateHotelDto, ownerId: string): Promise<Hotel>;
    findAll(query: QueryHotelsDto): Promise<{
        items: Hotel[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Hotel>;
    update(id: string, updateHotelDto: UpdateHotelDto, userId: string): Promise<Hotel>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
