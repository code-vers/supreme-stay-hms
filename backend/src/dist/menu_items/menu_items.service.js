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
exports.MenuItemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const restaurant_entity_1 = require("../restaurant/entities/restaurant.entity");
const typeorm_2 = require("typeorm");
const menu_item_entity_1 = require("./entities/menu_item.entity");
let MenuItemService = class MenuItemService {
    menuItemRepo;
    restaurantRepo;
    constructor(menuItemRepo, restaurantRepo) {
        this.menuItemRepo = menuItemRepo;
        this.restaurantRepo = restaurantRepo;
    }
    async verifyRestaurantOwner(restaurantId, userId) {
        const restaurant = await this.restaurantRepo.findOne({
            where: { id: restaurantId },
            relations: ['hotel'],
        });
        if (!restaurant) {
            throw new common_1.NotFoundException('Restaurant not found');
        }
        if (restaurant.hotel?.owner_id !== userId) {
            throw new common_1.ForbiddenException('You are not the owner of this restaurant');
        }
        return restaurant;
    }
    async create(createMenuItemDto, userId) {
        await this.verifyRestaurantOwner(createMenuItemDto.restaurant_id, userId);
        const menuItem = this.menuItemRepo.create({
            ...createMenuItemDto,
            is_available: createMenuItemDto.is_available ?? true,
        });
        return this.menuItemRepo.save(menuItem);
    }
    async findAll(restaurantId, query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;
        const restaurantExists = await this.restaurantRepo.findOne({
            where: { id: restaurantId },
        });
        if (!restaurantExists) {
            throw new common_1.NotFoundException('Restaurant not found');
        }
        const qb = this.menuItemRepo
            .createQueryBuilder('item')
            .where('item.restaurant_id = :restaurantId', { restaurantId });
        if (query.search) {
            qb.andWhere(new typeorm_2.Brackets((sub) => {
                sub
                    .where('item.name ILIKE :search', { search: `%${query.search}%` })
                    .orWhere('item.description ILIKE :search', {
                    search: `%${query.search}%`,
                });
            }));
        }
        if (query.is_available !== undefined) {
            qb.andWhere('item.is_available = :is_available', {
                is_available: query.is_available === 'true',
            });
        }
        if (query.minPrice) {
            qb.andWhere('item.price >= :minPrice', {
                minPrice: Number(query.minPrice),
            });
        }
        if (query.maxPrice) {
            qb.andWhere('item.price <= :maxPrice', {
                maxPrice: Number(query.maxPrice),
            });
        }
        qb.orderBy('item.name', 'ASC').skip(skip).take(limit);
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
        const item = await this.menuItemRepo.findOne({
            where: { id },
            relations: ['restaurant'],
        });
        if (!item) {
            throw new common_1.NotFoundException('Menu item not found');
        }
        return item;
    }
    async update(id, updateMenuItemDto, userId) {
        const item = await this.menuItemRepo.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Menu item not found');
        }
        await this.verifyRestaurantOwner(item.restaurant_id, userId);
        const updated = this.menuItemRepo.merge(item, updateMenuItemDto);
        return this.menuItemRepo.save(updated);
    }
    async remove(id, userId) {
        const item = await this.menuItemRepo.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Menu item not found');
        }
        await this.verifyRestaurantOwner(item.restaurant_id, userId);
        await this.menuItemRepo.remove(item);
        return { message: 'Menu item deleted successfully' };
    }
};
exports.MenuItemService = MenuItemService;
exports.MenuItemService = MenuItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __param(1, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MenuItemService);
//# sourceMappingURL=menu_items.service.js.map