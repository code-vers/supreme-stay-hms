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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("../booking/entities/booking.entity");
const hotel_entity_1 = require("../hotels/entities/hotel.entity");
const menu_order_item_entity_1 = require("../menu-order-item/entities/menu-order-item.entity");
const restaurant_table_reservation_entity_1 = require("../restaurant_table_reservation/entities/restaurant_table_reservation.entity");
const room_entity_1 = require("../room/entities/room.entity");
const typeorm_2 = require("typeorm");
const billing_entity_1 = require("./entities/billing.entity");
let BillingService = class BillingService {
    billingRepo;
    hotelRepo;
    roomRepo;
    bookingRepo;
    menuOrderRepo;
    reservationRepo;
    constructor(billingRepo, hotelRepo, roomRepo, bookingRepo, menuOrderRepo, reservationRepo) {
        this.billingRepo = billingRepo;
        this.hotelRepo = hotelRepo;
        this.roomRepo = roomRepo;
        this.bookingRepo = bookingRepo;
        this.menuOrderRepo = menuOrderRepo;
        this.reservationRepo = reservationRepo;
    }
    async verifyHotelOwner(hotelId, userId) {
        const hotel = await this.hotelRepo.findOne({ where: { id: hotelId } });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        if (hotel.owner_id !== userId)
            throw new common_1.UnauthorizedException('Unauthorized');
        return hotel;
    }
    async validateBillingContext(dto, userId) {
        switch (dto.billing_type) {
            case billing_entity_1.BillingType.ROOM_BOOKING: {
                if (!dto.booking_id || !dto.room_id) {
                    throw new common_1.BadRequestException('booking_id and room_id required for room booking billing');
                }
                const booking = await this.bookingRepo.findOne({
                    where: { id: dto.booking_id },
                });
                if (!booking)
                    throw new common_1.NotFoundException('Booking not found');
                if (booking.user_id !== userId) {
                    throw new common_1.UnauthorizedException('This booking does not belong to you');
                }
                if (booking.hotel_id !== dto.hotel_id) {
                    throw new common_1.BadRequestException('Booking does not belong to this hotel');
                }
                const existingBill = await this.billingRepo.findOne({
                    where: {
                        booking_id: dto.booking_id,
                        status: billing_entity_1.BillingStatus.PAID,
                    },
                });
                if (existingBill) {
                    throw new common_1.BadRequestException('This booking is already billed and paid');
                }
                break;
            }
            case billing_entity_1.BillingType.MENU_ORDER: {
                if (!dto.menu_order_id) {
                    throw new common_1.BadRequestException('menu_order_id required for menu order billing');
                }
                const menuOrder = await this.menuOrderRepo.findOne({
                    where: { id: dto.menu_order_id },
                });
                if (!menuOrder)
                    throw new common_1.NotFoundException('Menu order not found');
                if (menuOrder.hotel_id !== dto.hotel_id) {
                    throw new common_1.BadRequestException('Menu order does not belong to this hotel');
                }
                if (menuOrder.payment_status === menu_order_item_entity_1.PaymentStatus.PAID) {
                    throw new common_1.BadRequestException('This menu order is already paid');
                }
                break;
            }
            case billing_entity_1.BillingType.TABLE_RESERVATION: {
                if (!dto.reservation_id) {
                    throw new common_1.BadRequestException('reservation_id required for table reservation billing');
                }
                const reservation = await this.reservationRepo.findOne({
                    where: { id: dto.reservation_id },
                });
                if (!reservation)
                    throw new common_1.NotFoundException('Reservation not found');
                if (reservation.user_id !== userId) {
                    throw new common_1.UnauthorizedException('This reservation does not belong to you');
                }
                break;
            }
        }
        const expectedFinal = dto.amount - (dto.discount || 0);
        if (Math.abs(expectedFinal - dto.final_amount) > 0.01) {
            throw new common_1.BadRequestException(`final_amount mismatch: expected ${expectedFinal}, got ${dto.final_amount}`);
        }
    }
    async syncPaymentStatus(billing) {
        switch (billing.billing_type) {
            case billing_entity_1.BillingType.ROOM_BOOKING:
                if (billing.booking_id) {
                    await this.bookingRepo.update(billing.booking_id, {
                        payment_status: booking_entity_1.PaymentStatus.PAID,
                        booking_status: booking_entity_1.BookingStatus.CONFIRMED,
                    });
                }
                break;
            case billing_entity_1.BillingType.MENU_ORDER:
                if (billing.menu_order_id) {
                    await this.menuOrderRepo.update(billing.menu_order_id, {
                        payment_status: menu_order_item_entity_1.PaymentStatus.PAID,
                    });
                }
                break;
            case billing_entity_1.BillingType.TABLE_RESERVATION:
                if (billing.reservation_id) {
                    await this.reservationRepo.update(billing.reservation_id, {
                        status: restaurant_table_reservation_entity_1.ReservationStatus.PAID,
                    });
                }
                break;
        }
    }
    async create(dto, userId) {
        await this.validateBillingContext(dto, userId);
        const billing = this.billingRepo.create({
            ...dto,
            user_id: userId,
            discount: dto.discount ?? 0,
            status: billing_entity_1.BillingStatus.PENDING,
            ...(dto.payment_method === billing_entity_1.PaymentMethod.CASH && {
                status: billing_entity_1.BillingStatus.PAID,
                paid_at: new Date(),
            }),
        });
        const saved = await this.billingRepo.save(billing);
        if (dto.payment_method === billing_entity_1.PaymentMethod.CASH) {
            await this.syncPaymentStatus(saved);
        }
        return saved;
    }
    async findAll(query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;
        const qb = this.billingRepo
            .createQueryBuilder('billing')
            .leftJoinAndSelect('billing.hotel', 'hotel')
            .leftJoinAndSelect('billing.room', 'room')
            .leftJoinAndSelect('billing.booking', 'booking')
            .leftJoinAndSelect('billing.menuOrder', 'menuOrder')
            .leftJoinAndSelect('billing.reservation', 'reservation');
        if (query.hotel_id) {
            qb.andWhere('billing.hotel_id = :hotelId', { hotelId: query.hotel_id });
        }
        if (query.user_id) {
            qb.andWhere('billing.user_id = :userId', { userId: query.user_id });
        }
        if (query.room_id) {
            qb.andWhere('billing.room_id = :roomId', { roomId: query.room_id });
        }
        if (query.billing_type) {
            qb.andWhere('billing.billing_type = :billingType', {
                billingType: query.billing_type,
            });
        }
        if (query.status) {
            qb.andWhere('billing.status = :status', { status: query.status });
        }
        if (query.payment_method) {
            qb.andWhere('billing.payment_method = :paymentMethod', {
                paymentMethod: query.payment_method,
            });
        }
        if (query.date_from) {
            qb.andWhere('billing.created_at >= :dateFrom', {
                dateFrom: new Date(query.date_from),
            });
        }
        if (query.date_to) {
            qb.andWhere('billing.created_at <= :dateTo', {
                dateTo: new Date(query.date_to),
            });
        }
        if (query.search) {
            qb.andWhere(new typeorm_2.Brackets((sub) => {
                sub
                    .where('billing.transaction_id ILIKE :search', {
                    search: `%${query.search}%`,
                })
                    .orWhere('billing.note ILIKE :search', {
                    search: `%${query.search}%`,
                });
            }));
        }
        qb.orderBy('billing.created_at', 'DESC').skip(skip).take(limit);
        const [items, total] = await qb.getManyAndCount();
        return {
            items,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const billing = await this.billingRepo.findOne({
            where: { id },
            relations: ['hotel', 'room', 'booking', 'menuOrder', 'reservation'],
        });
        if (!billing)
            throw new common_1.NotFoundException('Billing record not found');
        return billing;
    }
    async findMyBillings(userId, query) {
        return this.findAll({ ...query, user_id: userId });
    }
    async update(id, dto, userId) {
        const billing = await this.billingRepo.findOne({ where: { id } });
        if (!billing)
            throw new common_1.NotFoundException('Billing record not found');
        await this.verifyHotelOwner(billing.hotel_id, userId);
        if (billing.status === billing_entity_1.BillingStatus.PAID &&
            dto.status === billing_entity_1.BillingStatus.PAID) {
            throw new common_1.BadRequestException('Billing is already paid');
        }
        if (dto.status === billing_entity_1.BillingStatus.PAID &&
            billing.status !== billing_entity_1.BillingStatus.PAID) {
            billing.paid_at = new Date();
            await this.syncPaymentStatus({ ...billing, ...dto });
        }
        if (dto.status === billing_entity_1.BillingStatus.REFUNDED) {
            if (billing.booking_id) {
                await this.bookingRepo.update(billing.booking_id, {
                    payment_status: booking_entity_1.PaymentStatus.REFUNDED,
                });
            }
        }
        const updated = this.billingRepo.merge(billing, dto);
        return this.billingRepo.save(updated);
    }
    async getHotelBillingReport(hotelId, userId) {
        await this.verifyHotelOwner(hotelId, userId);
        const summary = await this.billingRepo
            .createQueryBuilder('billing')
            .select('COUNT(billing.id)', 'total_bills')
            .addSelect('SUM(billing.final_amount)', 'total_revenue')
            .addSelect('SUM(billing.discount)', 'total_discount')
            .where('billing.hotel_id = :hotelId', { hotelId })
            .andWhere('billing.status = :status', { status: billing_entity_1.BillingStatus.PAID })
            .getRawOne();
        const typeBreakdown = await this.billingRepo
            .createQueryBuilder('billing')
            .select('billing.billing_type', 'type')
            .addSelect('COUNT(billing.id)', 'count')
            .addSelect('SUM(billing.final_amount)', 'revenue')
            .where('billing.hotel_id = :hotelId', { hotelId })
            .andWhere('billing.status = :status', { status: billing_entity_1.BillingStatus.PAID })
            .groupBy('billing.billing_type')
            .getRawMany();
        const methodBreakdown = await this.billingRepo
            .createQueryBuilder('billing')
            .select('billing.payment_method', 'method')
            .addSelect('COUNT(billing.id)', 'count')
            .addSelect('SUM(billing.final_amount)', 'total')
            .where('billing.hotel_id = :hotelId', { hotelId })
            .groupBy('billing.payment_method')
            .getRawMany();
        const statusBreakdown = await this.billingRepo
            .createQueryBuilder('billing')
            .select('billing.status', 'status')
            .addSelect('COUNT(billing.id)', 'count')
            .where('billing.hotel_id = :hotelId', { hotelId })
            .groupBy('billing.status')
            .getRawMany();
        const monthlyRevenue = await this.billingRepo
            .createQueryBuilder('billing')
            .select("TO_CHAR(billing.paid_at, 'YYYY-MM')", 'month')
            .addSelect('SUM(billing.final_amount)', 'revenue')
            .addSelect('COUNT(billing.id)', 'bills')
            .where('billing.hotel_id = :hotelId', { hotelId })
            .andWhere('billing.status = :status', { status: billing_entity_1.BillingStatus.PAID })
            .andWhere("billing.paid_at >= NOW() - INTERVAL '6 months'")
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const todaySummary = await this.billingRepo
            .createQueryBuilder('billing')
            .select('COUNT(billing.id)', 'count')
            .addSelect('SUM(billing.final_amount)', 'revenue')
            .where('billing.hotel_id = :hotelId', { hotelId })
            .andWhere('billing.status = :status', { status: billing_entity_1.BillingStatus.PAID })
            .andWhere('billing.paid_at BETWEEN :start AND :end', {
            start: startOfDay,
            end: endOfDay,
        })
            .getRawOne();
        return {
            summary: {
                total_bills: Number(summary?.total_bills || 0),
                total_revenue: Number(summary?.total_revenue || 0),
                total_discount: Number(summary?.total_discount || 0),
                today_count: Number(todaySummary?.count || 0),
                today_revenue: Number(todaySummary?.revenue || 0),
            },
            type_breakdown: typeBreakdown,
            method_breakdown: methodBreakdown,
            status_breakdown: statusBreakdown,
            monthly_revenue: monthlyRevenue,
        };
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(billing_entity_1.Billing)),
    __param(1, (0, typeorm_1.InjectRepository)(hotel_entity_1.Hotel)),
    __param(2, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(3, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(4, (0, typeorm_1.InjectRepository)(menu_order_item_entity_1.MenuOrderItem)),
    __param(5, (0, typeorm_1.InjectRepository)(restaurant_table_reservation_entity_1.Reservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BillingService);
//# sourceMappingURL=billings.service.js.map