import { Repository } from 'typeorm';
import { Hotel } from "../hotels/entities/hotel.entity";
import { CreateRoomDto } from './dto/create-room.dto';
import { QueryRoomDto } from './dto/query-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
export declare class RoomService {
    private readonly roomRepo;
    private readonly hotelRepo;
    constructor(roomRepo: Repository<Room>, hotelRepo: Repository<Hotel>);
    create(createRoomDto: CreateRoomDto, userId: string): Promise<Room>;
    findAll(query: QueryRoomDto): Promise<{
        items: Room[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Room>;
    update(id: string, updateRoomDto: UpdateRoomDto, userId: string): Promise<Room>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
