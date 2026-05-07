"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hotel_entity_1 = require("../hotels/entities/hotel.entity");
const room_entity_1 = require("./entities/room.entity");
let RoomService = class RoomService {
    roomRepo;
    hotelRepo;
    constructor(roomRepo, hotelRepo) {
        this.roomRepo = roomRepo;
        this.hotelRepo = hotelRepo;
    }
    async create(createRoomDto, userId) {
        const hotel = await this.hotelRepo.findOne({
            where: { id: createRoomDto.hotel_id },
        });
        if (!hotel) {
            throw new common_1.NotFoundException('Hotel not found');
        }
        if (hotel.owner_id !== userId) {
            throw new common_1.UnauthorizedException('Unauthorized');
        }
        const room = this.roomRepo.create(createRoomDto);
        return this.roomRepo.save(room);
    }
    async findAll(query) {
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
            qb.andWhere(new typeorm_2.Brackets((sub) => {
                sub
                    .where('room.room_type ILIKE :search', {
                    search: `%${query.search}%`,
                })
                    .orWhere('room.room_description ILIKE :search', {
                    search: `%${query.search}%`,
                });
            }));
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
    async findOne(id) {
        const room = await this.roomRepo.findOne({ where: { id } });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        return room;
    }
    async update(id, updateRoomDto, userId) {
        const room = await this.roomRepo.findOne({ where: { id } });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        const targetHotelId = updateRoomDto.hotel_id ?? room.hotel_id;
        const hotel = await this.hotelRepo.findOne({
            where: { id: targetHotelId },
        });
        if (!hotel) {
            throw new common_1.NotFoundException('Hotel not found');
        }
        if (hotel.owner_id !== userId) {
            throw new common_1.UnauthorizedException('Unauthorized');
        }
        const updated = this.roomRepo.merge(room, updateRoomDto);
        return this.roomRepo.save(updated);
    }
    async remove(id, userId) {
        const room = await this.roomRepo.findOne({ where: { id } });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        const hotel = await this.hotelRepo.findOne({
            where: { id: room.hotel_id },
        });
        if (!hotel) {
            throw new common_1.NotFoundException('Hotel not found');
        }
        if (hotel.owner_id !== userId) {
            throw new common_1.UnauthorizedException('Unauthorized');
        }
        await this.roomRepo.remove(room);
        return { message: 'Room deleted successfully' };
    }
};
exports.RoomService = RoomService;
exports.RoomService = RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(hotel_entity_1.Hotel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RoomService);
//# sourceMappingURL=room.service.js.map