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
exports.RestaurantTableService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hotel_entity_1 = require("../hotels/entities/hotel.entity");
const restaurant_entity_1 = require("../restaurant/entities/restaurant.entity");
const restaurant_table_entity_1 = require("./entities/restaurant-table.entity");
let RestaurantTableService = class RestaurantTableService {
    tableRepo;
    restaurantRepo;
    hotelRepo;
    constructor(tableRepo, restaurantRepo, hotelRepo) {
        this.tableRepo = tableRepo;
        this.restaurantRepo = restaurantRepo;
        this.hotelRepo = hotelRepo;
    }
    async create(dto, userId) {
        const restaurant = await this.restaurantRepo.findOne({
            where: { id: dto.restaurant_id },
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        const hotel = await this.hotelRepo.findOne({
            where: { id: restaurant.hotel_id },
        });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        if (hotel.owner_id !== userId)
            throw new common_1.UnauthorizedException('Unauthorized');
        const table = this.tableRepo.create(dto);
        return this.tableRepo.save(table);
    }
    async findAll(query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;
        const qb = this.tableRepo.createQueryBuilder('table');
        if (query.restaurant_id) {
            qb.andWhere('table.restaurant_id = :restaurantId', {
                restaurantId: query.restaurant_id,
            });
        }
        if (query.status) {
            qb.andWhere('table.status ILIKE :status', {
                status: `%${query.status}%`,
            });
        }
        if (query.minCapacity) {
            qb.andWhere('table.capacity >= :minCapacity', {
                minCapacity: Number(query.minCapacity),
            });
        }
        if (query.maxCapacity) {
            qb.andWhere('table.capacity <= :maxCapacity', {
                maxCapacity: Number(query.maxCapacity),
            });
        }
        if (query.search) {
            qb.andWhere(new typeorm_2.Brackets((sub) => {
                sub
                    .where('CAST(table.table_number AS TEXT) ILIKE :search', {
                    search: `%${query.search}%`,
                })
                    .orWhere('table.status ILIKE :search', {
                    search: `%${query.search}%`,
                });
            }));
        }
        qb.orderBy('table.table_number', 'ASC').skip(skip).take(limit);
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
    async findByRestaurantId(restaurantId, query) {
        const restaurant = await this.restaurantRepo.findOne({
            where: { id: restaurantId },
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        return this.findAll({
            ...query,
            restaurant_id: restaurantId,
        });
    }
    async findOne(id) {
        const table = await this.tableRepo.findOne({ where: { id } });
        if (!table)
            throw new common_1.NotFoundException('Restaurant table not found');
        return table;
    }
    async update(id, dto, userId) {
        const table = await this.tableRepo.findOne({ where: { id } });
        if (!table)
            throw new common_1.NotFoundException('Restaurant table not found');
        const targetRestaurantId = dto.restaurant_id ?? table.restaurant_id;
        const restaurant = await this.restaurantRepo.findOne({
            where: { id: targetRestaurantId },
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        const hotel = await this.hotelRepo.findOne({
            where: { id: restaurant.hotel_id },
        });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        if (hotel.owner_id !== userId)
            throw new common_1.UnauthorizedException('Unauthorized');
        const updated = this.tableRepo.merge(table, dto);
        return this.tableRepo.save(updated);
    }
    async remove(id, userId) {
        const table = await this.tableRepo.findOne({ where: { id } });
        if (!table)
            throw new common_1.NotFoundException('Restaurant table not found');
        const restaurant = await this.restaurantRepo.findOne({
            where: { id: table.restaurant_id },
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        const hotel = await this.hotelRepo.findOne({
            where: { id: restaurant.hotel_id },
        });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        if (hotel.owner_id !== userId)
            throw new common_1.UnauthorizedException('Unauthorized');
        await this.tableRepo.remove(table);
        return { message: 'Restaurant table deleted successfully' };
    }
};
exports.RestaurantTableService = RestaurantTableService;
exports.RestaurantTableService = RestaurantTableService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(restaurant_table_entity_1.RestaurantTable)),
    __param(1, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(2, (0, typeorm_1.InjectRepository)(hotel_entity_1.Hotel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RestaurantTableService);
//# sourceMappingURL=restaurant-table.service.js.map