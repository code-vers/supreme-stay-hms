// src/booking/booking.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Room } from 'src/room/entities/room.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {
  Booking,
  BookingStatus,
  PaymentStatus,
} from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,

    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
  ) {}

  // ── Owner verify ────────────────────────────────────────────────────────────
  private async verifyHotelOwner(hotelId: string, userId: string) {
    const hotel = await this.hotelRepo.findOne({ where: { id: hotelId } });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.owner_id !== userId)
      throw new UnauthorizedException('Unauthorized');
    return hotel;
  }

  // ── Room availability check ─────────────────────────────────────────────────
  async checkRoomAvailability(
    roomId: string,
    checkIn: string,
    checkOut: string,
    excludeBookingId?: string, // update এর সময় নিজেকে exclude করবে
  ): Promise<boolean> {
    const qb = this.bookingRepo
      .createQueryBuilder('booking')
      .where('booking.room_id = :roomId', { roomId })
      .andWhere('booking.booking_status NOT IN (:...excluded)', {
        excluded: [BookingStatus.CANCELLED, BookingStatus.CHECKED_OUT],
      })
      // Date overlap check: নতুন booking এর range আগের কোনো booking এর সাথে overlap করে কিনা
      .andWhere(
        '(:checkIn < booking.check_out AND :checkOut > booking.check_in)',
        { checkIn, checkOut },
      );

    if (excludeBookingId) {
      qb.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const conflict = await qb.getOne();
    return !conflict; // true = available
  }

  // ── Night & amount calculator ───────────────────────────────────────────────
  private calculateBookingAmounts(
    checkIn: string,
    checkOut: string,
    pricePerNight: number,
  ) {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const totalNights = Math.ceil(
      (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (totalNights <= 0) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    return {
      total_nights: totalNights,
      total_amount: totalNights * pricePerNight,
    };
  }

  // ── CREATE ──────────────────────────────────────────────────────────────────
  async create(dto: CreateBookingDto, userId: string): Promise<Booking> {
    // Hotel exists?
    const hotel = await this.hotelRepo.findOne({ where: { id: dto.hotel_id } });
    if (!hotel) throw new NotFoundException('Hotel not found');

    // Room exists and belongs to hotel?
    const room = await this.roomRepo.findOne({ where: { id: dto.room_id } });
    if (!room) throw new NotFoundException('Room not found');
    if (room.hotel_id !== dto.hotel_id) {
      throw new BadRequestException('Room does not belong to this hotel');
    }

    // Room available?
    const isAvailable = await this.checkRoomAvailability(
      dto.room_id,
      dto.check_in,
      dto.check_out,
    );
    if (!isAvailable) {
      throw new BadRequestException(
        'Room is not available for the selected dates',
      );
    }

    // Calculate nights & amount
    const { total_nights, total_amount } = this.calculateBookingAmounts(
      dto.check_in,
      dto.check_out,
      room.price_per_night, // Room entity তে এই field আছে assume করলাম
    );

    const booking = this.bookingRepo.create({
      ...dto,
      user_id: userId,
      room_type: room.room_type,
      room_number: room.room_number,
      total_nights,
      total_amount,
      booking_status: BookingStatus.PENDING,
      payment_status: PaymentStatus.PENDING,
    });

    return this.bookingRepo.save(booking);
  }

  // ── FIND ALL ────────────────────────────────────────────────────────────────
  async findAll(query: QueryBookingDto) {
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
      qb.andWhere(
        new Brackets((sub) => {
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
        }),
      );
    }

    qb.orderBy('booking.created_at', 'DESC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── FIND ONE ────────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['room', 'hotel'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  // ── My bookings ─────────────────────────────────────────────────────────────
  async findMyBookings(userId: string, query: QueryBookingDto) {
    return this.findAll({ ...query, user_id: userId });
  }

  // ── Availability check (public) ─────────────────────────────────────────────
  async getRoomAvailability(roomId: string, checkIn: string, checkOut: string) {
    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const isAvailable = await this.checkRoomAvailability(
      roomId,
      checkIn,
      checkOut,
    );

    // ওই room এর আগামী bookings গুলো দেখাবে (blocked dates এর জন্য)
    const upcomingBookings = await this.bookingRepo
      .createQueryBuilder('booking')
      .select(['booking.check_in', 'booking.check_out'])
      .where('booking.room_id = :roomId', { roomId })
      .andWhere('booking.check_out >= CURRENT_DATE')
      .andWhere('booking.booking_status NOT IN (:...excluded)', {
        excluded: [BookingStatus.CANCELLED, BookingStatus.CHECKED_OUT],
      })
      .orderBy('booking.check_in', 'ASC')
      .getMany();

    return {
      room_id: roomId,
      room_number: room.room_number,
      room_type: room.room_type,
      price_per_night: room.price_per_night,
      is_available: isAvailable,
      checked_range: { check_in: checkIn, check_out: checkOut },
      blocked_dates: upcomingBookings.map((b) => ({
        check_in: b.check_in,
        check_out: b.check_out,
      })),
    };
  }

  // ── UPDATE (owner: status + payment) ───────────────────────────────────────
  async update(
    id: string,
    dto: UpdateBookingDto,
    userId: string,
  ): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    await this.verifyHotelOwner(booking.hotel_id, userId);

    // Status transition validation
    if (dto.booking_status) {
      this.validateStatusTransition(booking.booking_status, dto.booking_status);
    }

    // Cash payment confirm হলে payment_status paid করে দাও
    if (
      dto.payment_method === 'cash' &&
      dto.booking_status === BookingStatus.CONFIRMED
    ) {
      dto.payment_status = PaymentStatus.PAID;
    }

    const updated = this.bookingRepo.merge(booking, dto);
    return this.bookingRepo.save(updated);
  }

  // ── CANCEL (user নিজে করবে) ─────────────────────────────────────────────────
  async cancelBooking(
    id: string,
    userId: string,
    reason?: string,
  ): Promise<{ message: string }> {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.user_id !== userId) {
      throw new UnauthorizedException('You can only cancel your own booking');
    }

    if (booking.booking_status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.booking_status === BookingStatus.CHECKED_IN) {
      throw new BadRequestException(
        'Cannot cancel a booking that is already checked in',
      );
    }

    await this.bookingRepo.update(id, {
      booking_status: BookingStatus.CANCELLED,
      cancellation_reason: reason,
      cancelled_at: new Date(),
    });

    return { message: 'Booking cancelled successfully' };
  }

  // ── REPORT: Hotel booking summary ───────────────────────────────────────────
  async getHotelBookingReport(hotelId: string, userId: string) {
    await this.verifyHotelOwner(hotelId, userId);

    // Status breakdown
    const statusBreakdown = await this.bookingRepo
      .createQueryBuilder('booking')
      .select('booking.booking_status', 'status')
      .addSelect('COUNT(booking.id)', 'count')
      .where('booking.hotel_id = :hotelId', { hotelId })
      .groupBy('booking.booking_status')
      .getRawMany();

    // Revenue (paid bookings)
    const revenueData = await this.bookingRepo
      .createQueryBuilder('booking')
      .select('SUM(booking.total_amount)', 'total_revenue')
      .addSelect('COUNT(booking.id)', 'total_bookings')
      .addSelect('AVG(booking.total_nights)', 'avg_nights')
      .where('booking.hotel_id = :hotelId', { hotelId })
      .andWhere('booking.payment_status = :status', {
        status: PaymentStatus.PAID,
      })
      .getRawOne();

    // Booking type breakdown
    const typeBreakdown = await this.bookingRepo
      .createQueryBuilder('booking')
      .select('booking.booking_type', 'type')
      .addSelect('COUNT(booking.id)', 'count')
      .where('booking.hotel_id = :hotelId', { hotelId })
      .groupBy('booking.booking_type')
      .getRawMany();

    // Room-wise occupancy
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
        cancelled: BookingStatus.CANCELLED,
      })
      .groupBy('booking.room_id')
      .addGroupBy('room.room_number')
      .addGroupBy('room.room_type')
      .orderBy('total_bookings', 'DESC')
      .getRawMany();

    // Today's check-ins & check-outs
    const today = new Date().toISOString().split('T')[0];
    const todayCheckIns = await this.bookingRepo.count({
      where: { hotel_id: hotelId, check_in: today },
    });
    const todayCheckOuts = await this.bookingRepo.count({
      where: { hotel_id: hotelId, check_out: today },
    });

    // Monthly revenue (last 6 months)
    const monthlyRevenue = await this.bookingRepo
      .createQueryBuilder('booking')
      .select("TO_CHAR(booking.created_at, 'YYYY-MM')", 'month')
      .addSelect('SUM(booking.total_amount)', 'revenue')
      .addSelect('COUNT(booking.id)', 'bookings')
      .where('booking.hotel_id = :hotelId', { hotelId })
      .andWhere("booking.created_at >= NOW() - INTERVAL '6 months'")
      .andWhere('booking.payment_status = :status', {
        status: PaymentStatus.PAID,
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

  // ── Status transition validator ──────────────────────────────────────────────
  private validateStatusTransition(
    current: BookingStatus,
    next: BookingStatus,
  ) {
    const allowed: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [
        BookingStatus.CONFIRMED,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.CONFIRMED]: [
        BookingStatus.CHECKED_IN,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.CHECKED_IN]: [BookingStatus.CHECKED_OUT],
      [BookingStatus.CHECKED_OUT]: [],
      [BookingStatus.CANCELLED]: [],
    };

    if (!allowed[current].includes(next)) {
      throw new BadRequestException(
        `Cannot transition from '${current}' to '${next}'`,
      );
    }
  }
}
