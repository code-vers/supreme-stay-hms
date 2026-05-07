import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { QueryRoomDto } from './dto/query-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    create(createRoomDto: CreateRoomDto, userId: string): Promise<import("./entities/room.entity").Room>;
    findAll(query: QueryRoomDto): Promise<{
        items: import("./entities/room.entity").Room[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/room.entity").Room>;
    update(id: string, updateRoomDto: UpdateRoomDto, userId: string): Promise<import("./entities/room.entity").Room>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
