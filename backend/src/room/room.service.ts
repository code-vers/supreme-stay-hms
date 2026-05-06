import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { QueryRoomDto } from './dto/query-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,
  ) {}

  async create(createRoomDto: CreateRoomDto, userId: string): Promise<Room> {
    const hotel = await this.hotelRepo.findOne({
      where: { id: createRoomDto.hotel_id },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    if (hotel.owner_id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const room = this.roomRepo.create(createRoomDto);
    return this.roomRepo.save(room);
  }

  async findAll(query: QueryRoomDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const qb = this.roomRepo.createQueryBuilder('room');

    if (query.hotel_id) {
      qb.andWhere('room.hotel_id = :hotelId', { hotelId: query.hotel_id });
    }
    if (query.room_type) {
      qb.andWhere('room.room_type ILIKE :roomType', {
        roomType: `%${query.room_type}%`,
      });
    }
    if (query.initial_status) {
      qb.andWhere('room.initial_status ILIKE :status', {
        status: `%${query.initial_status}%`,
      });
    }
    if (query.search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('room.room_type ILIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('room.room_description ILIKE :search', {
              search: `%${query.search}%`,
            });
        }),
      );
    }

    qb.orderBy('room.room_number', 'ASC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepo.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  async update(
    id: string,
    updateRoomDto: UpdateRoomDto,
    userId: string,
  ): Promise<Room> {
    const room = await this.roomRepo.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const targetHotelId = updateRoomDto.hotel_id ?? room.hotel_id;
    const hotel = await this.hotelRepo.findOne({
      where: { id: targetHotelId },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    if (hotel.owner_id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const updated = this.roomRepo.merge(room, updateRoomDto);
    return this.roomRepo.save(updated);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const room = await this.roomRepo.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const hotel = await this.hotelRepo.findOne({
      where: { id: room.hotel_id },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    if (hotel.owner_id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    await this.roomRepo.remove(room);
    return { message: 'Room deleted successfully' };
  }
}
