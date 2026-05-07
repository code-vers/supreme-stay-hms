import { CreateHotelDto } from './dto/create-hotel.dto';
import { QueryHotelsDto } from './dto/query-hotels.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelsService } from './hotels.service';
export declare class HotelsController {
    private readonly hotelsService;
    constructor(hotelsService: HotelsService);
    create(createHotelDto: CreateHotelDto, userId: string): Promise<import("./entities/hotel.entity").Hotel>;
    findAll(query: QueryHotelsDto): Promise<{
        items: import("./entities/hotel.entity").Hotel[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/hotel.entity").Hotel>;
    update(id: string, updateHotelDto: UpdateHotelDto, userId: string): Promise<import("./entities/hotel.entity").Hotel>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
