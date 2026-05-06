// src/billing/billing.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Booking,
  PaymentStatus as BookingPaymentStatus,
  BookingStatus,
} from 'src/booking/entities/booking.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import {
  MenuOrderItem,
  PaymentStatus as MenuPaymentStatus,
} from 'src/menu-order-item/entities/menu-order-item.entity';
import {
  Reservation,
  ReservationStatus,
} from 'src/reservation/entities/reservation.entity';
import { Room } from 'src/room/entities/room.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateBillingDto } from './dto/create-billing.dto';
import { QueryBillingDto } from './dto/query-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import {
  Billing,
  BillingStatus,
  BillingType,
  PaymentMethod,
} from './entities/billing.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing)
    private readonly billingRepo: Repository<Billing>,

    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,

    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,

    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(MenuOrderItem)
    private readonly menuOrderRepo: Repository<MenuOrderItem>,

    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  // ── Owner verify ─────────────────────────────────────────────────────────
  private async verifyHotelOwner(hotelId: string, userId: string) {
    const hotel = await this.hotelRepo.findOne({ where: { id: hotelId } });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.owner_id !== userId)
      throw new UnauthorizedException('Unauthorized');
    return hotel;
  }

  // ── Validate reference IDs by billing type ────────────────────────────────
  private async validateBillingContext(
    dto: CreateBillingDto,
    userId: string,
  ): Promise<void> {
    switch (dto.billing_type) {
      case BillingType.ROOM_BOOKING: {
        if (!dto.booking_id || !dto.room_id) {
          throw new BadRequestException(
            'booking_id and room_id required for room booking billing',
          );
        }
        const booking = await this.bookingRepo.findOne({
          where: { id: dto.booking_id },
        });
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.user_id !== userId) {
          throw new UnauthorizedException(
            'This booking does not belong to you',
          );
        }
        if (booking.hotel_id !== dto.hotel_id) {
          throw new BadRequestException(
            'Booking does not belong to this hotel',
          );
        }
        // Already paid check
        const existingBill = await this.billingRepo.findOne({
          where: {
            booking_id: dto.booking_id,
            status: BillingStatus.PAID,
          },
        });
        if (existingBill) {
          throw new BadRequestException(
            'This booking is already billed and paid',
          );
        }
        break;
      }

      case BillingType.MENU_ORDER: {
        if (!dto.menu_order_id) {
          throw new BadRequestException(
            'menu_order_id required for menu order billing',
          );
        }
        const menuOrder = await this.menuOrderRepo.findOne({
          where: { id: dto.menu_order_id },
        });
        if (!menuOrder) throw new NotFoundException('Menu order not found');
        if (menuOrder.hotel_id !== dto.hotel_id) {
          throw new BadRequestException(
            'Menu order does not belong to this hotel',
          );
        }
        if (menuOrder.payment_status === MenuPaymentStatus.PAID) {
          throw new BadRequestException('This menu order is already paid');
        }
        break;
      }

      case BillingType.TABLE_RESERVATION: {
        if (!dto.reservation_id) {
          throw new BadRequestException(
            'reservation_id required for table reservation billing',
          );
        }
        const reservation = await this.reservationRepo.findOne({
          where: { id: dto.reservation_id },
        });
        if (!reservation) throw new NotFoundException('Reservation not found');
        if (reservation.user_id !== userId) {
          throw new UnauthorizedException(
            'This reservation does not belong to you',
          );
        }
        break;
      }
    }

    // Final amount validation
    const expectedFinal = dto.amount - (dto.discount || 0);
    if (Math.abs(expectedFinal - dto.final_amount) > 0.01) {
      throw new BadRequestException(
        `final_amount mismatch: expected ${expectedFinal}, got ${dto.final_amount}`,
      );
    }
  }

  // ── Sync payment status back to source entity ─────────────────────────────
  private async syncPaymentStatus(billing: Billing): Promise<void> {
    switch (billing.billing_type) {
      case BillingType.ROOM_BOOKING:
        if (billing.booking_id) {
          await this.bookingRepo.update(billing.booking_id, {
            payment_status: BookingPaymentStatus.PAID,
            booking_status: BookingStatus.CONFIRMED,
          });
        }
        break;

      case BillingType.MENU_ORDER:
        if (billing.menu_order_id) {
          await this.menuOrderRepo.update(billing.menu_order_id, {
            payment_status: MenuPaymentStatus.PAID,
          });
        }
        break;

      case BillingType.TABLE_RESERVATION:
        if (billing.reservation_id) {
          await this.reservationRepo.update(billing.reservation_id, {
            status: ReservationStatus.PAID,
          });
        }
        break;
    }
  }

  // ── CREATE ────────────────────────────────────────────────────────────────
  async create(dto: CreateBillingDto, userId: string): Promise<Billing> {
    await this.validateBillingContext(dto, userId);

    const billing = this.billingRepo.create({
      ...dto,
      user_id: userId,
      discount: dto.discount ?? 0,
      status: BillingStatus.PENDING,
      // Cash payment হলে সাথে সাথে paid
      ...(dto.payment_method === PaymentMethod.CASH && {
        status: BillingStatus.PAID,
        paid_at: new Date(),
      }),
    });

    const saved = await this.billingRepo.save(billing);

    // Cash হলে সাথে সাথে source entity sync
    if (dto.payment_method === PaymentMethod.CASH) {
      await this.syncPaymentStatus(saved);
    }

    return saved;
  }

  // ── FIND ALL ──────────────────────────────────────────────────────────────
  async findAll(query: QueryBillingDto) {
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
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('billing.transaction_id ILIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('billing.note ILIKE :search', {
              search: `%${query.search}%`,
            });
        }),
      );
    }

    qb.orderBy('billing.created_at', 'DESC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── FIND ONE ──────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<Billing> {
    const billing = await this.billingRepo.findOne({
      where: { id },
      relations: ['hotel', 'room', 'booking', 'menuOrder', 'reservation'],
    });
    if (!billing) throw new NotFoundException('Billing record not found');
    return billing;
  }

  // ── My billings ───────────────────────────────────────────────────────────
  async findMyBillings(userId: string, query: QueryBillingDto) {
    return this.findAll({ ...query, user_id: userId });
  }

  // ── UPDATE — payment confirm (owner does this) ────────────────────────────
  async update(
    id: string,
    dto: UpdateBillingDto,
    userId: string,
  ): Promise<Billing> {
    const billing = await this.billingRepo.findOne({ where: { id } });
    if (!billing) throw new NotFoundException('Billing record not found');

    await this.verifyHotelOwner(billing.hotel_id, userId);

    if (
      billing.status === BillingStatus.PAID &&
      dto.status === BillingStatus.PAID
    ) {
      throw new BadRequestException('Billing is already paid');
    }

    // PAID status set হলে paid_at stamp করো
    if (
      dto.status === BillingStatus.PAID &&
      billing.status !== BillingStatus.PAID
    ) {
      billing.paid_at = new Date();
      // Source entity sync
      await this.syncPaymentStatus({ ...billing, ...dto });
    }

    // REFUNDED হলে source entity reset
    if (dto.status === BillingStatus.REFUNDED) {
      if (billing.booking_id) {
        await this.bookingRepo.update(billing.booking_id, {
          payment_status: BookingPaymentStatus.REFUNDED,
        });
      }
    }

    const updated = this.billingRepo.merge(billing, dto);
    return this.billingRepo.save(updated);
  }

  // ── REPORT: Hotel billing summary ─────────────────────────────────────────
  async getHotelBillingReport(hotelId: string, userId: string) {
    await this.verifyHotelOwner(hotelId, userId);

    // Overall summary
    const summary = await this.billingRepo
      .createQueryBuilder('billing')
      .select('COUNT(billing.id)', 'total_bills')
      .addSelect('SUM(billing.final_amount)', 'total_revenue')
      .addSelect('SUM(billing.discount)', 'total_discount')
      .where('billing.hotel_id = :hotelId', { hotelId })
      .andWhere('billing.status = :status', { status: BillingStatus.PAID })
      .getRawOne();

    // Billing type breakdown
    const typeBreakdown = await this.billingRepo
      .createQueryBuilder('billing')
      .select('billing.billing_type', 'type')
      .addSelect('COUNT(billing.id)', 'count')
      .addSelect('SUM(billing.final_amount)', 'revenue')
      .where('billing.hotel_id = :hotelId', { hotelId })
      .andWhere('billing.status = :status', { status: BillingStatus.PAID })
      .groupBy('billing.billing_type')
      .getRawMany();

    // Payment method breakdown
    const methodBreakdown = await this.billingRepo
      .createQueryBuilder('billing')
      .select('billing.payment_method', 'method')
      .addSelect('COUNT(billing.id)', 'count')
      .addSelect('SUM(billing.final_amount)', 'total')
      .where('billing.hotel_id = :hotelId', { hotelId })
      .groupBy('billing.payment_method')
      .getRawMany();

    // Status breakdown
    const statusBreakdown = await this.billingRepo
      .createQueryBuilder('billing')
      .select('billing.status', 'status')
      .addSelect('COUNT(billing.id)', 'count')
      .where('billing.hotel_id = :hotelId', { hotelId })
      .groupBy('billing.status')
      .getRawMany();

    // Monthly revenue (last 6 months)
    const monthlyRevenue = await this.billingRepo
      .createQueryBuilder('billing')
      .select("TO_CHAR(billing.paid_at, 'YYYY-MM')", 'month')
      .addSelect('SUM(billing.final_amount)', 'revenue')
      .addSelect('COUNT(billing.id)', 'bills')
      .where('billing.hotel_id = :hotelId', { hotelId })
      .andWhere('billing.status = :status', { status: BillingStatus.PAID })
      .andWhere("billing.paid_at >= NOW() - INTERVAL '6 months'")
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todaySummary = await this.billingRepo
      .createQueryBuilder('billing')
      .select('COUNT(billing.id)', 'count')
      .addSelect('SUM(billing.final_amount)', 'revenue')
      .where('billing.hotel_id = :hotelId', { hotelId })
      .andWhere('billing.status = :status', { status: BillingStatus.PAID })
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
}
