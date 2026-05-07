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
exports.MenuOrderItemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hotel_entity_1 = require("../hotels/entities/hotel.entity");
const menu_item_entity_1 = require("../menu_items/entities/menu_item.entity");
const restaurant_table_entity_1 = require("../restaurant-table/entities/restaurant-table.entity");
const restaurant_entity_1 = require("../restaurant/entities/restaurant.entity");
const room_entity_1 = require("../room/entities/room.entity");
const typeorm_2 = require("typeorm");
const menu_order_item_entity_1 = require("./entities/menu-order-item.entity");
let MenuOrderItemService = class MenuOrderItemService {
    orderRepo;
    hotelRepo;
    restaurantRepo;
    tableRepo;
    roomRepo;
    menuItemRepo;
    constructor(orderRepo, hotelRepo, restaurantRepo, tableRepo, roomRepo, menuItemRepo) {
        this.orderRepo = orderRepo;
        this.hotelRepo = hotelRepo;
        this.restaurantRepo = restaurantRepo;
        this.tableRepo = tableRepo;
        this.roomRepo = roomRepo;
        this.menuItemRepo = menuItemRepo;
    }
    async verifyHotelOwner(hotelId, userId) {
        const hotel = await this.hotelRepo.findOne({ where: { id: hotelId } });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        if (hotel.owner_id !== userId)
            throw new common_1.UnauthorizedException('Unauthorized');
        return hotel;
    }
    async validateOrderContext(dto) {
        const hotel = await this.hotelRepo.findOne({ where: { id: dto.hotel_id } });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        const restaurant = await this.restaurantRepo.findOne({
            where: { id: dto.restaurant_id },
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        if (restaurant.hotel_id !== dto.hotel_id) {
            throw new common_1.BadRequestException('Restaurant does not belong to this hotel');
        }
        const menuItem = await this.menuItemRepo.findOne({
            where: { id: dto.menu_item_id },
        });
        if (!menuItem)
            throw new common_1.NotFoundException('Menu item not found');
        if (menuItem.restaurant_id !== dto.restaurant_id) {
            throw new common_1.BadRequestException('Menu item does not belong to this restaurant');
        }
        if (!menuItem.is_available) {
            throw new common_1.BadRequestException('Menu item is currently unavailable');
        }
        if (dto.category === menu_order_item_entity_1.OrderCategory.DINE_IN ||
            dto.category === menu_order_item_entity_1.OrderCategory.TAKEAWAY) {
            if (!dto.table_id) {
                throw new common_1.BadRequestException('table_id is required for dine-in or takeaway orders');
            }
            const table = await this.tableRepo.findOne({
                where: { id: dto.table_id },
            });
            if (!table)
                throw new common_1.NotFoundException('Table not found');
            if (table.restaurant_id !== dto.restaurant_id) {
                throw new common_1.BadRequestException('Table does not belong to this restaurant');
            }
        }
        if (dto.category === menu_order_item_entity_1.OrderCategory.ROOM_SERVICE) {
            if (!dto.room_id) {
                throw new common_1.BadRequestException('room_id is required for room service orders');
            }
            const room = await this.roomRepo.findOne({ where: { id: dto.room_id } });
            if (!room)
                throw new common_1.NotFoundException('Room not found');
            if (room.hotel_id !== dto.hotel_id) {
                throw new common_1.BadRequestException('Room does not belong to this hotel');
            }
        }
        const expectedSubtotal = dto.price * dto.quantity;
        if (Math.abs(expectedSubtotal - dto.subtotal) > 0.01) {
            throw new common_1.BadRequestException(`Subtotal mismatch: expected ${expectedSubtotal}, got ${dto.subtotal}`);
        }
    }
    async create(dto, userId) {
        await this.validateOrderContext(dto);
        const order = this.orderRepo.create({
            ...dto,
            payment_status: menu_order_item_entity_1.PaymentStatus.PENDING,
        });
        return this.orderRepo.save(order);
    }
    async findAll(query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;
        const qb = this.orderRepo
            .createQueryBuilder('ord')
            .leftJoinAndSelect('ord.menuItem', 'menuItem')
            .leftJoinAndSelect('ord.table', 'table')
            .leftJoinAndSelect('ord.room', 'room')
            .leftJoinAndSelect('ord.restaurant', 'restaurant');
        if (query.hotel_id) {
            qb.andWhere('ord.hotel_id = :hotelId', { hotelId: query.hotel_id });
        }
        if (query.restaurant_id) {
            qb.andWhere('ord.restaurant_id = :restaurantId', {
                restaurantId: query.restaurant_id,
            });
        }
        if (query.table_id) {
            qb.andWhere('ord.table_id = :tableId', { tableId: query.table_id });
        }
        if (query.room_id) {
            qb.andWhere('ord.room_id = :roomId', { roomId: query.room_id });
        }
        if (query.menu_item_id) {
            qb.andWhere('ord.menu_item_id = :menuItemId', {
                menuItemId: query.menu_item_id,
            });
        }
        if (query.category) {
            qb.andWhere('ord.category = :category', { category: query.category });
        }
        if (query.payment_status) {
            qb.andWhere('ord.payment_status = :paymentStatus', {
                paymentStatus: query.payment_status,
            });
        }
        if (query.date_from) {
            qb.andWhere('ord.created_at >= :dateFrom', {
                dateFrom: new Date(query.date_from),
            });
        }
        if (query.date_to) {
            qb.andWhere('ord.created_at <= :dateTo', {
                dateTo: new Date(query.date_to),
            });
        }
        if (query.search) {
            qb.andWhere(new typeorm_2.Brackets((sub) => {
                sub
                    .where('menuItem.name ILIKE :search', {
                    search: `%${query.search}%`,
                })
                    .orWhere('ord.note ILIKE :search', {
                    search: `%${query.search}%`,
                });
            }));
        }
        qb.orderBy('ord.created_at', 'DESC').skip(skip).take(limit);
        const [items, total] = await qb.getManyAndCount();
        return {
            items,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['menuItem', 'table', 'room', 'restaurant', 'hotel'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async findMyOrders(userId, query) {
        return this.findAll({ ...query });
    }
    async update(id, dto, userId) {
        const order = await this.orderRepo.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        await this.verifyHotelOwner(order.hotel_id, userId);
        if (order.payment_status === menu_order_item_entity_1.PaymentStatus.PAID &&
            dto.payment_status !== undefined) {
            throw new common_1.BadRequestException('Already paid order cannot be modified');
        }
        const updated = this.orderRepo.merge(order, dto);
        return this.orderRepo.save(updated);
    }
    async remove(id, userId) {
        const order = await this.orderRepo.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        await this.verifyHotelOwner(order.hotel_id, userId);
        if (order.payment_status === menu_order_item_entity_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('Paid orders cannot be deleted');
        }
        await this.orderRepo.remove(order);
        return { message: 'Order deleted successfully' };
    }
    async getHotelOrderReport(hotelId, userId) {
        await this.verifyHotelOwner(hotelId, userId);
        const categoryBreakdown = await this.orderRepo
            .createQueryBuilder('ord')
            .select('ord.category', 'category')
            .addSelect('COUNT(ord.id)', 'total_orders')
            .addSelect('SUM(ord.subtotal)', 'total_revenue')
            .where('ord.hotel_id = :hotelId', { hotelId })
            .andWhere('ord.payment_status = :status', { status: menu_order_item_entity_1.PaymentStatus.PAID })
            .groupBy('ord.category')
            .getRawMany();
        const paymentBreakdown = await this.orderRepo
            .createQueryBuilder('ord')
            .select('ord.payment_status', 'payment_status')
            .addSelect('COUNT(ord.id)', 'count')
            .addSelect('SUM(ord.subtotal)', 'total')
            .where('ord.hotel_id = :hotelId', { hotelId })
            .groupBy('ord.payment_status')
            .getRawMany();
        const topMenuItems = await this.orderRepo
            .createQueryBuilder('ord')
            .select('ord.menu_item_id', 'menu_item_id')
            .addSelect('menuItem.name', 'menu_item_name')
            .addSelect('COUNT(ord.id)', 'order_count')
            .addSelect('SUM(ord.subtotal)', 'revenue')
            .leftJoin('ord.menuItem', 'menuItem')
            .where('ord.hotel_id = :hotelId', { hotelId })
            .groupBy('ord.menu_item_id')
            .addGroupBy('menuItem.name')
            .orderBy('order_count', 'DESC')
            .limit(5)
            .getRawMany();
        const restaurantBreakdown = await this.orderRepo
            .createQueryBuilder('ord')
            .select('ord.restaurant_id', 'restaurant_id')
            .addSelect('restaurant.name', 'restaurant_name')
            .addSelect('COUNT(ord.id)', 'total_orders')
            .addSelect('SUM(ord.subtotal)', 'total_revenue')
            .leftJoin('ord.restaurant', 'restaurant')
            .where('ord.hotel_id = :hotelId', { hotelId })
            .andWhere('ord.payment_status = :status', { status: menu_order_item_entity_1.PaymentStatus.PAID })
            .groupBy('ord.restaurant_id')
            .addGroupBy('restaurant.name')
            .getRawMany();
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const todaySummary = await this.orderRepo
            .createQueryBuilder('ord')
            .select('COUNT(ord.id)', 'total_orders')
            .addSelect('SUM(ord.subtotal)', 'total_revenue')
            .where('ord.hotel_id = :hotelId', { hotelId })
            .andWhere('ord.created_at BETWEEN :start AND :end', {
            start: startOfDay,
            end: endOfDay,
        })
            .getRawOne();
        const totalRevenue = await this.orderRepo
            .createQueryBuilder('ord')
            .select('SUM(ord.subtotal)', 'total')
            .where('ord.hotel_id = :hotelId', { hotelId })
            .andWhere('ord.payment_status = :status', { status: menu_order_item_entity_1.PaymentStatus.PAID })
            .getRawOne();
        return {
            summary: {
                total_revenue: Number(totalRevenue?.total || 0),
                today_orders: Number(todaySummary?.total_orders || 0),
                today_revenue: Number(todaySummary?.total_revenue || 0),
            },
            category_breakdown: categoryBreakdown,
            payment_breakdown: paymentBreakdown,
            top_menu_items: topMenuItems,
            restaurant_breakdown: restaurantBreakdown,
        };
    }
    async getRestaurantOrderReport(restaurantId, userId) {
        const restaurant = await this.restaurantRepo.findOne({
            where: { id: restaurantId },
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        await this.verifyHotelOwner(restaurant.hotel_id, userId);
        const orders = await this.orderRepo.find({
            where: { restaurant_id: restaurantId },
        });
        const paid = orders.filter((o) => o.payment_status === menu_order_item_entity_1.PaymentStatus.PAID);
        const pending = orders.filter((o) => o.payment_status === menu_order_item_entity_1.PaymentStatus.PENDING);
        return {
            total_orders: orders.length,
            paid_orders: paid.length,
            pending_orders: pending.length,
            total_revenue: paid.reduce((sum, o) => sum + Number(o.subtotal), 0),
            dine_in_orders: orders.filter((o) => o.category === menu_order_item_entity_1.OrderCategory.DINE_IN)
                .length,
            room_service_orders: orders.filter((o) => o.category === menu_order_item_entity_1.OrderCategory.ROOM_SERVICE).length,
            takeaway_orders: orders.filter((o) => o.category === menu_order_item_entity_1.OrderCategory.TAKEAWAY).length,
        };
    }
};
exports.MenuOrderItemService = MenuOrderItemService;
exports.MenuOrderItemService = MenuOrderItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_order_item_entity_1.MenuOrderItem)),
    __param(1, (0, typeorm_1.InjectRepository)(hotel_entity_1.Hotel)),
    __param(2, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(3, (0, typeorm_1.InjectRepository)(restaurant_table_entity_1.RestaurantTable)),
    __param(4, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(5, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MenuOrderItemService);
//# sourceMappingURL=menu-order-item.service.js.map