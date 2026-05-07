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
exports.HotelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hotel_entity_1 = require("./entities/hotel.entity");
let HotelsService = class HotelsService {
    hotelRepo;
    constructor(hotelRepo) {
        this.hotelRepo = hotelRepo;
    }
    async create(createHotelDto, ownerId) {
        const saved = await this.hotelRepo.save({
            ...createHotelDto,
            owner_id: ownerId,
        });
        return saved;
    }
    async findAll(query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;
        const qb = this.hotelRepo.createQueryBuilder('hotel');
        if (query.city) {
            qb.andWhere('hotel.city ILIKE :city', { city: `%${query.city}%` });
        }
        if (query.country) {
            qb.andWhere('hotel.country ILIKE :country', {
                country: `%${query.country}%`,
            });
        }
        if (query.minRating) {
            qb.andWhere('hotel.default_rating >= :minRating', {
                minRating: Number(query.minRating),
            });
        }
        if (query.maxRating) {
            qb.andWhere('hotel.default_rating <= :maxRating', {
                maxRating: Number(query.maxRating),
            });
        }
        if (query.minRooms) {
            qb.andWhere('hotel.no_of_rooms >= :minRooms', {
                minRooms: Number(query.minRooms),
            });
        }
        if (query.maxRooms) {
            qb.andWhere('hotel.no_of_rooms <= :maxRooms', {
                maxRooms: Number(query.maxRooms),
            });
        }
        if (query.search) {
            qb.andWhere(new typeorm_2.Brackets((subQb) => {
                subQb
                    .where('hotel.hotel_name ILIKE :search', {
                    search: `%${query.search}%`,
                })
                    .orWhere('hotel.tagline ILIKE :search', {
                    search: `%${query.search}%`,
                })
                    .orWhere('hotel.address ILIKE :search', {
                    search: `%${query.search}%`,
                })
                    .orWhere('hotel.city ILIKE :search', {
                    search: `%${query.search}%`,
                })
                    .orWhere('hotel.country ILIKE :search', {
                    search: `%${query.search}%`,
                });
            }));
        }
        qb.orderBy('hotel.id', 'DESC').skip(skip).take(limit);
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
        const hotel = await this.hotelRepo.findOne({ where: { id } });
        if (!hotel) {
            throw new common_1.NotFoundException('Hotel not found');
        }
        return hotel;
    }
    async update(id, updateHotelDto, userId) {
        const hotel = await this.hotelRepo.findOne({ where: { id } });
        if (!hotel) {
            throw new common_1.NotFoundException('Hotel not found');
        }
        if (hotel.owner_id !== userId) {
            throw new common_1.UnauthorizedException('Unauthorized');
        }
        const updated = this.hotelRepo.merge(hotel, updateHotelDto);
        return this.hotelRepo.save(updated);
    }
    async remove(id, userId) {
        const hotel = await this.hotelRepo.findOne({ where: { id } });
        if (!hotel) {
            throw new common_1.NotFoundException('Hotel not found');
        }
        if (hotel.owner_id !== userId) {
            throw new common_1.UnauthorizedException('Unauthorized');
        }
        await this.hotelRepo.remove(hotel);
        return { message: 'Hotel deleted successfully' };
    }
};
exports.HotelsService = HotelsService;
exports.HotelsService = HotelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hotel_entity_1.Hotel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HotelsService);
//# sourceMappingURL=hotels.service.js.map