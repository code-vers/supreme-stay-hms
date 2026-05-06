// src/reservation/reservation.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import {
  RestaurantTable,
  RestaurantTableStatus,
} from 'src/restaurant-table/entities/restaurant-table.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Brackets, Repository } from 'typeorm';

import { QueryReservationDto } from './dto/query-reservation.dto';

import { CreateReservationDto } from './dto/create-restaurant_table_reservation.dto';
import { UpdateReservationDto } from './dto/update-restaurant_table_reservation.dto';
import {
  Reservation,
  ReservationStatus,
} from './entities/restaurant_table_reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,

    @InjectRepository(RestaurantTable)
    private readonly tableRepo: Repository<RestaurantTable>,

    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,

    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,
  ) {}

  // ─── Owner verification (same chain as restaurant-table) ──────────────────
  private async verifyHotelOwner(restaurantId: string, userId: string) {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const hotel = await this.hotelRepo.findOne({
      where: { id: restaurant.hotel_id },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.owner_id !== userId)
      throw new UnauthorizedException('Unauthorized');

    return { restaurant, hotel };
  }

  // ─── Table availability check ─────────────────────────────────────────────
  async checkTableAvailability(
    tableId: string,
    reservationDate: Date,
    bookingDurationMinutes = 120,
  ): Promise<boolean> {
    if (bookingDurationMinutes < 15) {
      throw new BadRequestException(
        'booking_duration_minutes must be at least 15',
      );
    }

    const table = await this.tableRepo.findOne({ where: { id: tableId } });
    if (!table) throw new NotFoundException('Table not found');

    const requestedStart = new Date(reservationDate);
    const requestedEnd = new Date(
      requestedStart.getTime() + bookingDurationMinutes * 60 * 1000,
    );

    const existingReservation = await this.reservationRepo
      .createQueryBuilder('res')
      .where('res.table_id = :tableId', { tableId })
      .andWhere('res.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [ReservationStatus.CANCELLED, ReservationStatus.PAID],
      })
      .andWhere(
        `
        COALESCE(res.check_in_time, res.reservation_date) < :requestedEnd
        AND
        COALESCE(
          res.check_out_time,
          COALESCE(res.check_in_time, res.reservation_date) + interval '120 minutes'
        ) > :requestedStart
      `,
        {
          requestedStart,
          requestedEnd,
        },
      )
      .getOne();

    return !existingReservation; // true = available
  }

  // ─── CREATE ───────────────────────────────────────────────────────────────
  async create(
    dto: CreateReservationDto,
    userId: string,
  ): Promise<Reservation> {
    const reservationDate = new Date(dto.reservation_date);
    const bookingDurationMinutes = dto.booking_duration_minutes ?? 120;
    const checkInTime = reservationDate;
    const checkOutTime = new Date(
      reservationDate.getTime() + bookingDurationMinutes * 60 * 1000,
    );

    if (Number.isNaN(reservationDate.getTime())) {
      throw new BadRequestException('Invalid reservation_date');
    }

    // Table exists check
    const table = await this.tableRepo.findOne({ where: { id: dto.table_id } });
    if (!table) throw new NotFoundException('Table not found');

    // Restaurant-table mismatch check
    if (table.restaurant_id !== dto.restaurant_id) {
      throw new BadRequestException('Table does not belong to this restaurant');
    }

    // Availability check
    const isAvailable = await this.checkTableAvailability(
      dto.table_id,
      reservationDate,
      bookingDurationMinutes,
    );
    if (!isAvailable) {
      throw new BadRequestException(
        'Table is not available for the selected date and time slot',
      );
    }

    // Table status RESERVED te set
    await this.tableRepo.update(dto.table_id, {
      status: RestaurantTableStatus.RESERVED,
    });

    const reservation = this.reservationRepo.create({
      ...dto,
      user_id: userId,
      status: ReservationStatus.PENDING,
      reservation_date: reservationDate,
      check_in_time: checkInTime,
      check_out_time: checkOutTime,
      booking_duration_minutes: bookingDurationMinutes,
    });

    return this.reservationRepo.save(reservation);
  }

  // ─── FIND ALL (with filters) ──────────────────────────────────────────────
  async findAll(query: QueryReservationDto) {
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
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('res.order_by ILIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('res.status ILIKE :search', {
              search: `%${query.search}%`,
            });
        }),
      );
    }

    qb.orderBy('res.reservation_date', 'DESC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── FIND ONE ─────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepo.findOne({
      where: { id },
      relations: ['table', 'restaurant'],
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }

  // ─── My reservations (logged-in user) ────────────────────────────────────
  async findMyReservations(userId: string, query: QueryReservationDto) {
    return this.findAll({ ...query, user_id: userId });
  }

  // ─── UPDATE STATUS (owner only) ───────────────────────────────────────────
  async updateStatus(
    id: string,
    dto: UpdateReservationDto,
    userId: string,
  ): Promise<Reservation> {
    const reservation = await this.reservationRepo.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Reservation not found');

    await this.verifyHotelOwner(reservation.restaurant_id, userId);

    // Status transition logic
    if (dto.status) {
      this.validateStatusTransition(reservation.status, dto.status);

      // Table status sync
      if (
        dto.status === ReservationStatus.PAID ||
        dto.status === ReservationStatus.CANCELLED
      ) {
        await this.tableRepo.update(reservation.table_id, {
          status: RestaurantTableStatus.AVAILABLE,
        });
      } else if (dto.status === ReservationStatus.COOKING) {
        await this.tableRepo.update(reservation.table_id, {
          status: RestaurantTableStatus.OCCUPIED,
        });
      }
    }

    const updated = this.reservationRepo.merge(reservation, dto);
    return this.reservationRepo.save(updated);
  }

  // ─── CANCEL (user nিজে cancel করতে পারবে) ────────────────────────────────
  async cancelReservation(
    id: string,
    userId: string,
  ): Promise<{ message: string }> {
    const reservation = await this.reservationRepo.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Reservation not found');

    if (reservation.user_id !== userId) {
      throw new UnauthorizedException(
        'You can only cancel your own reservation',
      );
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Reservation is already cancelled');
    }

    if (
      reservation.status === ReservationStatus.COOKING ||
      reservation.status === ReservationStatus.SERVED
    ) {
      throw new BadRequestException(
        'Cannot cancel reservation that is already in progress',
      );
    }

    await this.reservationRepo.update(id, {
      status: ReservationStatus.CANCELLED,
    });
    await this.tableRepo.update(reservation.table_id, {
      status: RestaurantTableStatus.AVAILABLE,
    });

    return { message: 'Reservation cancelled successfully' };
  }

  // ─── TABLE AVAILABILITY CHECK (public endpoint) ───────────────────────────
  async getTableAvailability(
    tableId: string,
    date: string,
    bookingDurationMinutes = 120,
  ) {
    const table = await this.tableRepo.findOne({ where: { id: tableId } });
    if (!table) throw new NotFoundException('Table not found');

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Invalid date');
    }
    if (bookingDurationMinutes < 15) {
      throw new BadRequestException('duration_minutes must be at least 15');
    }

    const isAvailable = await this.checkTableAvailability(
      tableId,
      parsedDate,
      bookingDurationMinutes,
    );

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

  // ─── REPORT: Restaurant reservation summary ───────────────────────────────
  async getRestaurantReport(restaurantId: string, userId: string) {
    await this.verifyHotelOwner(restaurantId, userId);

    const allReservations = await this.reservationRepo.find({
      where: { restaurant_id: restaurantId },
    });

    const statusCounts = Object.values(ReservationStatus).reduce(
      (acc, status) => {
        acc[status] = allReservations.filter((r) => r.status === status).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalRevenue = allReservations
      .filter((r) => r.status === ReservationStatus.PAID)
      .reduce((sum, r) => sum + r.grand_total, 0);

    const totalDiscount = allReservations
      .filter((r) => r.status === ReservationStatus.PAID)
      .reduce((sum, r) => sum + (r.discount || 0), 0);

    // Table-wise breakdown
    const tableReport = await this.reservationRepo
      .createQueryBuilder('res')
      .select('res.table_id', 'table_id')
      .addSelect('table.table_number', 'table_number')
      .addSelect('COUNT(res.id)', 'total_reservations')
      .addSelect(
        `SUM(CASE WHEN res.status = 'paid' THEN res.grand_total ELSE 0 END)`,
        'revenue',
      )
      .addSelect(
        `SUM(CASE WHEN res.status = 'cancelled' THEN 1 ELSE 0 END)`,
        'cancellations',
      )
      .leftJoin('res.table', 'table')
      .where('res.restaurant_id = :restaurantId', { restaurantId })
      .groupBy('res.table_id')
      .addGroupBy('table.table_number')
      .getRawMany();

    // Today's reservations
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

  // ─── Status transition validator ──────────────────────────────────────────
  private validateStatusTransition(
    current: ReservationStatus,
    next: ReservationStatus,
  ) {
    const allowedTransitions: Record<ReservationStatus, ReservationStatus[]> = {
      [ReservationStatus.PENDING]: [
        ReservationStatus.COOKING,
        ReservationStatus.CANCELLED,
      ],
      [ReservationStatus.COOKING]: [ReservationStatus.SERVED],
      [ReservationStatus.SERVED]: [ReservationStatus.PAID],
      [ReservationStatus.PAID]: [],
      [ReservationStatus.CANCELLED]: [],
    };

    if (!allowedTransitions[current].includes(next)) {
      throw new BadRequestException(
        `Cannot transition from '${current}' to '${next}'`,
      );
    }
  }
}
