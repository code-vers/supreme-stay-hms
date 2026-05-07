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
exports.RestaurantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hotel_entity_1 = require("../hotels/entities/hotel.entity");
const restaurant_entity_1 = require("./entities/restaurant.entity");
let RestaurantService = class RestaurantService {
    restaurantRepo;
    hotelRepo;
    constructor(restaurantRepo, hotelRepo) {
        this.restaurantRepo = restaurantRepo;
        this.hotelRepo = hotelRepo;
    }
    async create(createRestaurantDto, userId) {
        const hotel = await this.hotelRepo.findOne({
            where: { id: createRestaurantDto.hotel_id },
        });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        if (hotel.owner_id !== userId)
            throw new common_1.UnauthorizedException('Unauthorized');
        const restaurant = this.restaurantRepo.create(createRestaurantDto);
        return this.restaurantRepo.save(restaurant);
    }
    async findAll(query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;
        const qb = this.restaurantRepo.createQueryBuilder('restaurant');
        if (query.hotel_id) {
            qb.andWhere('restaurant.hotel_id = :hotelId', {
                hotelId: query.hotel_id,
            });
        }
        if (query.type) {
            qb.andWhere('restaurant.type ILIKE :type', { type: `%${query.type}%` });
        }
        if (query.status) {
            qb.andWhere('restaurant.status ILIKE :status', {
                status: `%${query.status}%`,
            });
        }
        if (query.search) {
            qb.andWhere(new typeorm_2.Brackets((sub) => {
                sub
                    .where('restaurant.name ILIKE :search', {
                    search: `%${query.search}%`,
                })
                    .orWhere('restaurant.type ILIKE :search', {
                    search: `%${query.search}%`,
                });
            }));
        }
        qb.orderBy('restaurant.name', 'ASC').skip(skip).take(limit);
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
        const restaurant = await this.restaurantRepo.findOne({ where: { id } });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        return restaurant;
    }
    async update(id, updateRestaurantDto, userId) {
        const restaurant = await this.restaurantRepo.findOne({ where: { id } });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        const targetHotelId = updateRestaurantDto.hotel_id ?? restaurant.hotel_id;
        const hotel = await this.hotelRepo.findOne({
            where: { id: targetHotelId },
        });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        if (hotel.owner_id !== userId)
            throw new common_1.UnauthorizedException('Unauthorized');
        const updated = this.restaurantRepo.merge(restaurant, updateRestaurantDto);
        return this.restaurantRepo.save(updated);
    }
    async remove(id, userId) {
        const restaurant = await this.restaurantRepo.findOne({ where: { id } });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        const hotel = await this.hotelRepo.findOne({
            where: { id: restaurant.hotel_id },
        });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        if (hotel.owner_id !== userId)
            throw new common_1.UnauthorizedException('Unauthorized');
        await this.restaurantRepo.remove(restaurant);
        return { message: 'Restaurant deleted successfully' };
    }
};
exports.RestaurantService = RestaurantService;
exports.RestaurantService = RestaurantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(1, (0, typeorm_1.InjectRepository)(hotel_entity_1.Hotel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RestaurantService);
//# sourceMappingURL=restaurant.service.js.map