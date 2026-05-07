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
exports.ReservationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hotel_entity_1 = require("../hotels/entities/hotel.entity");
const restaurant_table_entity_1 = require("../restaurant-table/entities/restaurant-table.entity");
const restaurant_entity_1 = require("../restaurant/entities/restaurant.entity");
const typeorm_2 = require("typeorm");
const restaurant_table_reservation_entity_1 = require("./entities/restaurant_table_reservation.entity");
let ReservationService = class ReservationService {
    reservationRepo;
    tableRepo;
    restaurantRepo;
    hotelRepo;
    constructor(reservationRepo, tableRepo, restaurantRepo, hotelRepo) {
        this.reservationRepo = reservationRepo;
        this.tableRepo = tableRepo;
        this.restaurantRepo = restaurantRepo;
        this.hotelRepo = hotelRepo;
    }
    async verifyHotelOwner(restaurantId, userId) {
        const restaurant = await this.restaurantRepo.findOne({
            where: { id: restaurantId },
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
        return { restaurant, hotel };
    }
    async checkTableAvailability(tableId, reservationDate, bookingDurationMinutes = 120) {
        if (bookingDurationMinutes < 15) {
            throw new common_1.BadRequestException('booking_duration_minutes must be at least 15');
        }
        const table = await this.tableRepo.findOne({ where: { id: tableId } });
        if (!table)
            throw new common_1.NotFoundException('Table not found');
        const requestedStart = new Date(reservationDate);
        const requestedEnd = new Date(requestedStart.getTime() + bookingDurationMinutes * 60 * 1000);
        const existingReservation = await this.reservationRepo
            .createQueryBuilder('res')
            .where('res.table_id = :tableId', { tableId })
            .andWhere('res.status NOT IN (:...excludedStatuses)', {
            excludedStatuses: [restaurant_table_reservation_entity_1.ReservationStatus.CANCELLED, restaurant_table_reservation_entity_1.ReservationStatus.PAID],
        })
            .andWhere(`
        COALESCE(res.check_in_time, res.reservation_date) < :requestedEnd
        AND
        COALESCE(
          res.check_out_time,
          COALESCE(res.check_in_time, res.reservation_date) + interval '120 minutes'
        ) > :requestedStart
      `, {
            requestedStart,
            requestedEnd,
        })
            .getOne();
        return !existingReservation;
    }
    async create(dto, userId) {
        const reservationDate = new Date(dto.reservation_date);
        const bookingDurationMinutes = dto.booking_duration_minutes ?? 120;
        const checkInTime = reservationDate;
        const checkOutTime = new Date(reservationDate.getTime() + bookingDurationMinutes * 60 * 1000);
        if (Number.isNaN(reservationDate.getTime())) {
            throw new common_1.BadRequestException('Invalid reservation_date');
        }
        const table = await this.tableRepo.findOne({ where: { id: dto.table_id } });
        if (!table)
            throw new common_1.NotFoundException('Table not found');
        if (table.restaurant_id !== dto.restaurant_id) {
            throw new common_1.BadRequestException('Table does not belong to this restaurant');
        }
        const isAvailable = await this.checkTableAvailability(dto.table_id, reservationDate, bookingDurationMinutes);
        if (!isAvailable) {
            throw new common_1.BadRequestException('Table is not available for the selected date and time slot');
        }
        await this.tableRepo.update(dto.table_id, {
            status: restaurant_table_entity_1.RestaurantTableStatus.RESERVED,
        });
        const reservation = this.reservationRepo.create({
            ...dto,
            user_id: userId,
            status: restaurant_table_reservation_entity_1.ReservationStatus.PENDING,
            reservation_date: reservationDate,
            check_in_time: checkInTime,
            check_out_time: checkOutTime,
            booking_duration_minutes: bookingDurationMinutes,
        });
        return this.reservationRepo.save(reservation);
    }
    async findAll(query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;
        const qb = this.reservationRepo
            .createQueryBuilder('res')
            .leftJoinAndSelect('res.table', 'table')
            .leftJoinAndSelect('res.restaurant', 'restaurant');
        if (query.restaurant_id) {
            qb.andWhere('res.restaurant_id = :restaurantId', {
                restaurantId: query.restaurant_id,
            });
        }
        if (query.table_id) {
            qb.andWhere('res.table_id = :tableId', { tableId: query.table_id });
        }
        if (query.user_id) {
            qb.andWhere('res.user_id = :userId', { userId: query.user_id });
        }
        if (query.status) {
            qb.andWhere('res.status = :status', { status: query.status });
        }
        if (query.order_type) {
            qb.andWhere('res.order_type = :orderType', {
                orderType: query.order_type,
            });
        }
        if (query.date_from) {
            qb.andWhere('res.reservation_date >= :dateFrom', {
                dateFrom: new Date(query.date_from),
            });
        }
        if (query.date_to) {
            qb.andWhere('res.reservation_date <= :dateTo', {
                dateTo: new Date(query.date_to),
            });
        }
        if (query.search) {
            qb.andWhere(new typeorm_2.Brackets((sub) => {
                sub
                    .where('res.order_by ILIKE :search', {
                    search: `%${query.search}%`,
                })
                    .orWhere('res.status ILIKE :search', {
                    search: `%${query.search}%`,
                });
            }));
        }
        qb.orderBy('res.reservation_date', 'DESC').skip(skip).take(limit);
        const [items, total] = await qb.getManyAndCount();
        return {
            items,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const reservation = await this.reservationRepo.findOne({
            where: { id },
            relations: ['table', 'restaurant'],
        });
        if (!reservation)
            throw new common_1.NotFoundException('Reservation not found');
        return reservation;
    }
    async findMyReservations(userId, query) {
        return this.findAll({ ...query, user_id: userId });
    }
    async updateStatus(id, dto, userId) {
        const reservation = await this.reservationRepo.findOne({ where: { id } });
        if (!reservation)
            throw new common_1.NotFoundException('Reservation not found');
        await this.verifyHotelOwner(reservation.restaurant_id, userId);
        if (dto.status) {
            this.validateStatusTransition(reservation.status, dto.status);
            if (dto.status === restaurant_table_reservation_entity_1.ReservationStatus.PAID ||
                dto.status === restaurant_table_reservation_entity_1.ReservationStatus.CANCELLED) {
                await this.tableRepo.update(reservation.table_id, {
                    status: restaurant_table_entity_1.RestaurantTableStatus.AVAILABLE,
                });
            }
            else if (dto.status === restaurant_table_reservation_entity_1.ReservationStatus.COOKING) {
                await this.tableRepo.update(reservation.table_id, {
                    status: restaurant_table_entity_1.RestaurantTableStatus.OCCUPIED,
                });
            }
        }
        const updated = this.reservationRepo.merge(reservation, dto);
        return this.reservationRepo.save(updated);
    }
    async cancelReservation(id, userId) {
        const reservation = await this.reservationRepo.findOne({ where: { id } });
        if (!reservation)
            throw new common_1.NotFoundException('Reservation not found');
        if (reservation.user_id !== userId) {
            throw new common_1.UnauthorizedException('You can only cancel your own reservation');
        }
        if (reservation.status === restaurant_table_reservation_entity_1.ReservationStatus.CANCELLED) {
            throw new common_1.BadRequestException('Reservation is already cancelled');
        }
        if (reservation.status === restaurant_table_reservation_entity_1.ReservationStatus.COOKING ||
            reservation.status === restaurant_table_reservation_entity_1.ReservationStatus.SERVED) {
            throw new common_1.BadRequestException('Cannot cancel reservation that is already in progress');
        }
        await this.reservationRepo.update(id, {
            status: restaurant_table_reservation_entity_1.ReservationStatus.CANCELLED,
        });
        await this.tableRepo.update(reservation.table_id, {
            status: restaurant_table_entity_1.RestaurantTableStatus.AVAILABLE,
        });
        return { message: 'Reservation cancelled successfully' };
    }
    async getTableAvailability(tableId, date, bookingDurationMinutes = 120) {
        const table = await this.tableRepo.findOne({ where: { id: tableId } });
        if (!table)
            throw new common_1.NotFoundException('Table not found');
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date');
        }
        if (bookingDurationMinutes < 15) {
            throw new common_1.BadRequestException('duration_minutes must be at least 15');
        }
        const isAvailable = await this.checkTableAvailability(tableId, parsedDate, bookingDurationMinutes);
        return {
            table_id: tableId,
            table_number: table.table_number,
            capacity: table.capacity,
            current_status: table.status,
            is_available_on_slot: isAvailable,
            checked_date: date,
            booking_duration_minutes: bookingDurationMinutes,
        };
    }
    async getRestaurantReport(restaurantId, userId) {
        await this.verifyHotelOwner(restaurantId, userId);
        const allReservations = await this.reservationRepo.find({
            where: { restaurant_id: restaurantId },
        });
        const statusCounts = Object.values(restaurant_table_reservation_entity_1.ReservationStatus).reduce((acc, status) => {
            acc[status] = allReservations.filter((r) => r.status === status).length;
            return acc;
        }, {});
        const totalRevenue = allReservations
            .filter((r) => r.status === restaurant_table_reservation_entity_1.ReservationStatus.PAID)
            .reduce((sum, r) => sum + r.grand_total, 0);
        const totalDiscount = allReservations
            .filter((r) => r.status === restaurant_table_reservation_entity_1.ReservationStatus.PAID)
            .reduce((sum, r) => sum + (r.discount || 0), 0);
        const tableReport = await this.reservationRepo
            .createQueryBuilder('res')
            .select('res.table_id', 'table_id')
            .addSelect('table.table_number', 'table_number')
            .addSelect('COUNT(res.id)', 'total_reservations')
            .addSelect(`SUM(CASE WHEN res.status = 'paid' THEN res.grand_total ELSE 0 END)`, 'revenue')
            .addSelect(`SUM(CASE WHEN res.status = 'cancelled' THEN 1 ELSE 0 END)`, 'cancellations')
            .leftJoin('res.table', 'table')
            .where('res.restaurant_id = :restaurantId', { restaurantId })
            .groupBy('res.table_id')
            .addGroupBy('table.table_number')
            .getRawMany();
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const todayCount = await this.reservationRepo
            .createQueryBuilder('res')
            .where('res.restaurant_id = :restaurantId', { restaurantId })
            .andWhere('res.reservation_date BETWEEN :start AND :end', {
            start: startOfDay,
            end: endOfDay,
        })
            .getCount();
        return {
            summary: {
                total_reservations: allReservations.length,
                total_revenue: totalRevenue,
                total_discount: totalDiscount,
                today_reservations: todayCount,
                status_breakdown: statusCounts,
            },
            table_report: tableReport,
        };
    }
    validateStatusTransition(current, next) {
        const allowedTransitions = {
            [restaurant_table_reservation_entity_1.ReservationStatus.PENDING]: [
                restaurant_table_reservation_entity_1.ReservationStatus.COOKING,
                restaurant_table_reservation_entity_1.ReservationStatus.CANCELLED,
            ],
            [restaurant_table_reservation_entity_1.ReservationStatus.COOKING]: [restaurant_table_reservation_entity_1.ReservationStatus.SERVED],
            [restaurant_table_reservation_entity_1.ReservationStatus.SERVED]: [restaurant_table_reservation_entity_1.ReservationStatus.PAID],
            [restaurant_table_reservation_entity_1.ReservationStatus.PAID]: [],
            [restaurant_table_reservation_entity_1.ReservationStatus.CANCELLED]: [],
        };
        if (!allowedTransitions[current].includes(next)) {
            throw new common_1.BadRequestException(`Cannot transition from '${current}' to '${next}'`);
        }
    }
};
exports.ReservationService = ReservationService;
exports.ReservationService = ReservationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(restaurant_table_reservation_entity_1.Reservation)),
    __param(1, (0, typeorm_1.InjectRepository)(restaurant_table_entity_1.RestaurantTable)),
    __param(2, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(3, (0, typeorm_1.InjectRepository)(hotel_entity_1.Hotel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReservationService);
//# sourceMappingURL=restaurant_table_reservation.service.js.map