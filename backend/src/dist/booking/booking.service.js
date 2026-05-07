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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hotel_entity_1 = require("../hotels/entities/hotel.entity");
const room_entity_1 = require("../room/entities/room.entity");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
let BookingService = class BookingService {
    bookingRepo;
    hotelRepo;
    roomRepo;
    constructor(bookingRepo, hotelRepo, roomRepo) {
        this.bookingRepo = bookingRepo;
        this.hotelRepo = hotelRepo;
        this.roomRepo = roomRepo;
    }
    async verifyHotelOwner(hotelId, userId) {
        const hotel = await this.hotelRepo.findOne({ where: { id: hotelId } });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        if (hotel.owner_id !== userId)
            throw new common_1.UnauthorizedException('Unauthorized');
        return hotel;
    }
    async checkRoomAvailability(roomId, checkIn, checkOut, excludeBookingId) {
        const qb = this.bookingRepo
            .createQueryBuilder('booking')
            .where('booking.room_id = :roomId', { roomId })
            .andWhere('booking.booking_status NOT IN (:...excluded)', {
            excluded: [booking_entity_1.BookingStatus.CANCELLED, booking_entity_1.BookingStatus.CHECKED_OUT],
        })
            .andWhere('(:checkIn < booking.check_out AND :checkOut > booking.check_in)', { checkIn, checkOut });
        if (excludeBookingId) {
            qb.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
        }
        const conflict = await qb.getOne();
        return !conflict;
    }
    calculateBookingAmounts(checkIn, checkOut, pricePerNight) {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const totalNights = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
        if (totalNights <= 0) {
            throw new common_1.BadRequestException('Check-out must be after check-in');
        }
        return {
            total_nights: totalNights,
            total_amount: totalNights * pricePerNight,
        };
    }
    async create(dto, userId) {
        const hotel = await this.hotelRepo.findOne({ where: { id: dto.hotel_id } });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        const room = await this.roomRepo.findOne({ where: { id: dto.room_id } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        if (room.hotel_id !== dto.hotel_id) {
            throw new common_1.BadRequestException('Room does not belong to this hotel');
        }
        const isAvailable = await this.checkRoomAvailability(dto.room_id, dto.check_in, dto.check_out);
        if (!isAvailable) {
            throw new common_1.BadRequestException('Room is not available for the selected dates');
        }
        const { total_nights, total_amount } = this.calculateBookingAmounts(dto.check_in, dto.check_out, room.rate_per_night);
        const booking = this.bookingRepo.create({
            ...dto,
            user_id: userId,
            room_type: room.room_type,
            room_number: room.room_number,
            total_nights,
            total_amount,
            booking_status: booking_entity_1.BookingStatus.PENDING,
            payment_status: booking_entity_1.PaymentStatus.PENDING,
        });
        return this.bookingRepo.save(booking);
    }
    async findAll(query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;
        const qb = this.bookingRepo
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.room', 'room')
            .leftJoinAndSelect('booking.hotel', 'hotel');
        if (query.hotel_id) {
            qb.andWhere('booking.hotel_id = :hotelId', { hotelId: query.hotel_id });
        }
        if (query.room_id) {
            qb.andWhere('booking.room_id = :roomId', { roomId: query.room_id });
        }
        if (query.user_id) {
            qb.andWhere('booking.user_id = :userId', { userId: query.user_id });
        }
        if (query.booking_status) {
            qb.andWhere('booking.booking_status = :bookingStatus', {
                bookingStatus: query.booking_status,
            });
        }
        if (query.payment_status) {
            qb.andWhere('booking.payment_status = :paymentStatus', {
                paymentStatus: query.payment_status,
            });
        }
        if (query.booking_type) {
            qb.andWhere('booking.booking_type = :bookingType', {
                bookingType: query.booking_type,
            });
        }
        if (query.date_from) {
            qb.andWhere('booking.check_in >= :dateFrom', {
                dateFrom: query.date_from,
            });
        }
        if (query.date_to) {
            qb.andWhere('booking.check_out <= :dateTo', {
                dateTo: query.date_to,
            });
        }
        if (query.search) {
            qb.andWhere(new typeorm_2.Brackets((sub) => {
                sub
                    .where('booking.guest_name ILIKE :search', {
                    search: `%${query.search}%`,
                })
                    .orWhere('booking.email ILIKE :search', {
                    search: `%${query.search}%`,
                })
                    .orWhere('booking.phone_number ILIKE :search', {
                    search: `%${query.search}%`,
                });
            }));
        }
        qb.orderBy('booking.created_at', 'DESC').skip(skip).take(limit);
        const [items, total] = await qb.getManyAndCount();
        return {
            items,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const booking = await this.bookingRepo.findOne({
            where: { id },
            relations: ['room', 'hotel'],
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return booking;
    }
    async findMyBookings(userId, query) {
        return this.findAll({ ...query, user_id: userId });
    }
    async getRoomAvailability(roomId, checkIn, checkOut) {
        const room = await this.roomRepo.findOne({ where: { id: roomId } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        const isAvailable = await this.checkRoomAvailability(roomId, checkIn, checkOut);
        const upcomingBookings = await this.bookingRepo
            .createQueryBuilder('booking')
            .select(['booking.check_in', 'booking.check_out'])
            .where('booking.room_id = :roomId', { roomId })
            .andWhere('booking.check_out >= CURRENT_DATE')
            .andWhere('booking.booking_status NOT IN (:...excluded)', {
            excluded: [booking_entity_1.BookingStatus.CANCELLED, booking_entity_1.BookingStatus.CHECKED_OUT],
        })
            .orderBy('booking.check_in', 'ASC')
            .getMany();
        return {
            room_id: roomId,
            room_number: room.room_number,
            room_type: room.room_type,
            price_per_night: room.rate_per_night,
            is_available: isAvailable,
            checked_range: { check_in: checkIn, check_out: checkOut },
            blocked_dates: upcomingBookings.map((b) => ({
                check_in: b.check_in,
                check_out: b.check_out,
            })),
        };
    }
    async update(id, dto, userId) {
        const booking = await this.bookingRepo.findOne({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        await this.verifyHotelOwner(booking.hotel_id, userId);
        if (dto.booking_status) {
            this.validateStatusTransition(booking.booking_status, dto.booking_status);
        }
        if (dto.payment_method === 'cash' &&
            dto.booking_status === booking_entity_1.BookingStatus.CONFIRMED) {
            dto.payment_status = booking_entity_1.PaymentStatus.PAID;
        }
        const updated = this.bookingRepo.merge(booking, dto);
        return this.bookingRepo.save(updated);
    }
    async cancelBooking(id, userId, reason) {
        const booking = await this.bookingRepo.findOne({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.user_id !== userId) {
            throw new common_1.UnauthorizedException('You can only cancel your own booking');
        }
        if (booking.booking_status === booking_entity_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Booking is already cancelled');
        }
        if (booking.booking_status === booking_entity_1.BookingStatus.CHECKED_IN) {
            throw new common_1.BadRequestException('Cannot cancel a booking that is already checked in');
        }
        await this.bookingRepo.update(id, {
            booking_status: booking_entity_1.BookingStatus.CANCELLED,
            cancellation_reason: reason,
            cancelled_at: new Date(),
        });
        return { message: 'Booking cancelled successfully' };
    }
    async getHotelBookingReport(hotelId, userId) {
        await this.verifyHotelOwner(hotelId, userId);
        const statusBreakdown = await this.bookingRepo
            .createQueryBuilder('booking')
            .select('booking.booking_status', 'status')
            .addSelect('COUNT(booking.id)', 'count')
            .where('booking.hotel_id = :hotelId', { hotelId })
            .groupBy('booking.booking_status')
            .getRawMany();
        const revenueData = await this.bookingRepo
            .createQueryBuilder('booking')
            .select('SUM(booking.total_amount)', 'total_revenue')
            .addSelect('COUNT(booking.id)', 'total_bookings')
            .addSelect('AVG(booking.total_nights)', 'avg_nights')
            .where('booking.hotel_id = :hotelId', { hotelId })
            .andWhere('booking.payment_status = :status', {
            status: booking_entity_1.PaymentStatus.PAID,
        })
            .getRawOne();
        const typeBreakdown = await this.bookingRepo
            .createQueryBuilder('booking')
            .select('booking.booking_type', 'type')
            .addSelect('COUNT(booking.id)', 'count')
            .where('booking.hotel_id = :hotelId', { hotelId })
            .groupBy('booking.booking_type')
            .getRawMany();
        const roomOccupancy = await this.bookingRepo
            .createQueryBuilder('booking')
            .select('booking.room_id', 'room_id')
            .addSelect('room.room_number', 'room_number')
            .addSelect('room.room_type', 'room_type')
            .addSelect('COUNT(booking.id)', 'total_bookings')
            .addSelect('SUM(booking.total_amount)', 'revenue')
            .leftJoin('booking.room', 'room')
            .where('booking.hotel_id = :hotelId', { hotelId })
            .andWhere('booking.booking_status != :cancelled', {
            cancelled: booking_entity_1.BookingStatus.CANCELLED,
        })
            .groupBy('booking.room_id')
            .addGroupBy('room.room_number')
            .addGroupBy('room.room_type')
            .orderBy('total_bookings', 'DESC')
            .getRawMany();
        const today = new Date().toISOString().split('T')[0];
        const todayCheckIns = await this.bookingRepo.count({
            where: { hotel_id: hotelId, check_in: today },
        });
        const todayCheckOuts = await this.bookingRepo.count({
            where: { hotel_id: hotelId, check_out: today },
        });
        const monthlyRevenue = await this.bookingRepo
            .createQueryBuilder('booking')
            .select("TO_CHAR(booking.created_at, 'YYYY-MM')", 'month')
            .addSelect('SUM(booking.total_amount)', 'revenue')
            .addSelect('COUNT(booking.id)', 'bookings')
            .where('booking.hotel_id = :hotelId', { hotelId })
            .andWhere("booking.created_at >= NOW() - INTERVAL '6 months'")
            .andWhere('booking.payment_status = :status', {
            status: booking_entity_1.PaymentStatus.PAID,
        })
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();
        return {
            summary: {
                total_revenue: Number(revenueData?.total_revenue || 0),
                total_bookings: Number(revenueData?.total_bookings || 0),
                avg_nights: Number(revenueData?.avg_nights || 0).toFixed(1),
                today_check_ins: todayCheckIns,
                today_check_outs: todayCheckOuts,
            },
            status_breakdown: statusBreakdown,
            type_breakdown: typeBreakdown,
            room_occupancy: roomOccupancy,
            monthly_revenue: monthlyRevenue,
        };
    }
    validateStatusTransition(current, next) {
        const allowed = {
            [booking_entity_1.BookingStatus.PENDING]: [
                booking_entity_1.BookingStatus.CONFIRMED,
                booking_entity_1.BookingStatus.CANCELLED,
            ],
            [booking_entity_1.BookingStatus.CONFIRMED]: [
                booking_entity_1.BookingStatus.CHECKED_IN,
                booking_entity_1.BookingStatus.CANCELLED,
            ],
            [booking_entity_1.BookingStatus.CHECKED_IN]: [booking_entity_1.BookingStatus.CHECKED_OUT],
            [booking_entity_1.BookingStatus.CHECKED_OUT]: [],
            [booking_entity_1.BookingStatus.CANCELLED]: [],
        };
        if (!allowed[current].includes(next)) {
            throw new common_1.BadRequestException(`Cannot transition from '${current}' to '${next}'`);
        }
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(hotel_entity_1.Hotel)),
    __param(2, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BookingService);
//# sourceMappingURL=booking.service.js.map