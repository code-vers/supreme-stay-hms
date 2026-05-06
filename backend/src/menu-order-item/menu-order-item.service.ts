import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { MenuItem } from 'src/menu_items/entities/menu_item.entity';
import { RestaurantTable } from 'src/restaurant-table/entities/restaurant-table.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Room } from 'src/room/entities/room.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateMenuOrderItemDto } from './dto/create-menu-order-item.dto';
import { QueryMenuOrderItemDto } from './dto/query-menu-order-item.dto';
import { UpdateMenuOrderItemDto } from './dto/update-menu-order-item.dto';
import {
  MenuOrderItem,
  OrderCategory,
  PaymentStatus,
} from './entities/menu-order-item.entity';

@Injectable()
export class MenuOrderItemService {
  constructor(
    @InjectRepository(MenuOrderItem)
    private readonly orderRepo: Repository<MenuOrderItem>,

    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,

    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,

    @InjectRepository(RestaurantTable)
    private readonly tableRepo: Repository<RestaurantTable>,

    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,

    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,
  ) {}

  // ── Owner verify ────────────────────────────────────────────────────────────
  private async verifyHotelOwner(hotelId: string, userId: string) {
    const hotel = await this.hotelRepo.findOne({ where: { id: hotelId } });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.owner_id !== userId)
      throw new UnauthorizedException('Unauthorized');
    return hotel;
  }

  // ── Validate order context ──────────────────────────────────────────────────
  private async validateOrderContext(
    dto: CreateMenuOrderItemDto,
  ): Promise<void> {
    // Hotel exists?
    const hotel = await this.hotelRepo.findOne({ where: { id: dto.hotel_id } });
    if (!hotel) throw new NotFoundException('Hotel not found');

    // Restaurant exists and belongs to hotel?
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: dto.restaurant_id },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (restaurant.hotel_id !== dto.hotel_id) {
      throw new BadRequestException('Restaurant does not belong to this hotel');
    }

    // MenuItem exists and belongs to restaurant?
    const menuItem = await this.menuItemRepo.findOne({
      where: { id: dto.menu_item_id },
    });
    if (!menuItem) throw new NotFoundException('Menu item not found');
    if (menuItem.restaurant_id !== dto.restaurant_id) {
      throw new BadRequestException(
        'Menu item does not belong to this restaurant',
      );
    }
    if (!menuItem.is_available) {
      throw new BadRequestException('Menu item is currently unavailable');
    }

    // Dine-in / Takeaway — table check
    if (
      dto.category === OrderCategory.DINE_IN ||
      dto.category === OrderCategory.TAKEAWAY
    ) {
      if (!dto.table_id) {
        throw new BadRequestException(
          'table_id is required for dine-in or takeaway orders',
        );
      }
      const table = await this.tableRepo.findOne({
        where: { id: dto.table_id },
      });
      if (!table) throw new NotFoundException('Table not found');
      if (table.restaurant_id !== dto.restaurant_id) {
        throw new BadRequestException(
          'Table does not belong to this restaurant',
        );
      }
    }

    // Room service — room check
    if (dto.category === OrderCategory.ROOM_SERVICE) {
      if (!dto.room_id) {
        throw new BadRequestException(
          'room_id is required for room service orders',
        );
      }
      const room = await this.roomRepo.findOne({ where: { id: dto.room_id } });
      if (!room) throw new NotFoundException('Room not found');
      if (room.hotel_id !== dto.hotel_id) {
        throw new BadRequestException('Room does not belong to this hotel');
      }
    }

    // Subtotal cross-check
    const expectedSubtotal = dto.price * dto.quantity;
    if (Math.abs(expectedSubtotal - dto.subtotal) > 0.01) {
      throw new BadRequestException(
        `Subtotal mismatch: expected ${expectedSubtotal}, got ${dto.subtotal}`,
      );
    }
  }

  // ── CREATE ──────────────────────────────────────────────────────────────────
  async create(
    dto: CreateMenuOrderItemDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId: string,
  ): Promise<MenuOrderItem> {
    await this.validateOrderContext(dto);

    const order = this.orderRepo.create({
      ...dto,
      payment_status: PaymentStatus.PENDING,
    });

    return this.orderRepo.save(order);
  }

  // ── FIND ALL ────────────────────────────────────────────────────────────────
  async findAll(query: QueryMenuOrderItemDto) {
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
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('menuItem.name ILIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('ord.note ILIKE :search', {
              search: `%${query.search}%`,
            });
        }),
      );
    }

    qb.orderBy('ord.created_at', 'DESC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── FIND ONE ────────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<MenuOrderItem> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['menuItem', 'table', 'room', 'restaurant', 'hotel'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // ── My orders (logged-in user er hotel/room based) ──────────────────────────
  async findMyOrders(userId: string, query: QueryMenuOrderItemDto) {
    // User er room_id / table_id query params দিয়ে filter করবে
    return this.findAll({ ...query });
  }

  // ── UPDATE payment status (owner only) ─────────────────────────────────────
  async update(
    id: string,
    dto: UpdateMenuOrderItemDto,
    userId: string,
  ): Promise<MenuOrderItem> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    await this.verifyHotelOwner(order.hotel_id, userId);

    if (
      order.payment_status === PaymentStatus.PAID &&
      dto.payment_status !== undefined
    ) {
      throw new BadRequestException('Already paid order cannot be modified');
    }

    const updated = this.orderRepo.merge(order, dto);
    return this.orderRepo.save(updated);
  }

  // ── DELETE (owner only) ─────────────────────────────────────────────────────
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    await this.verifyHotelOwner(order.hotel_id, userId);

    if (order.payment_status === PaymentStatus.PAID) {
      throw new BadRequestException('Paid orders cannot be deleted');
    }

    await this.orderRepo.remove(order);
    return { message: 'Order deleted successfully' };
  }

  // ── REPORT: Hotel-wide order summary ───────────────────────────────────────
  async getHotelOrderReport(hotelId: string, userId: string) {
    await this.verifyHotelOwner(hotelId, userId);

    // Category breakdown
    const categoryBreakdown = await this.orderRepo
      .createQueryBuilder('ord')
      .select('ord.category', 'category')
      .addSelect('COUNT(ord.id)', 'total_orders')
      .addSelect('SUM(ord.subtotal)', 'total_revenue')
      .where('ord.hotel_id = :hotelId', { hotelId })
      .andWhere('ord.payment_status = :status', { status: PaymentStatus.PAID })
      .groupBy('ord.category')
      .getRawMany();

    // Payment status breakdown
    const paymentBreakdown = await this.orderRepo
      .createQueryBuilder('ord')
      .select('ord.payment_status', 'payment_status')
      .addSelect('COUNT(ord.id)', 'count')
      .addSelect('SUM(ord.subtotal)', 'total')
      .where('ord.hotel_id = :hotelId', { hotelId })
      .groupBy('ord.payment_status')
      .getRawMany();

    // Top 5 menu items by order count
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

    // Restaurant-wise breakdown
    const restaurantBreakdown = await this.orderRepo
      .createQueryBuilder('ord')
      .select('ord.restaurant_id', 'restaurant_id')
      .addSelect('restaurant.name', 'restaurant_name')
      .addSelect('COUNT(ord.id)', 'total_orders')
      .addSelect('SUM(ord.subtotal)', 'total_revenue')
      .leftJoin('ord.restaurant', 'restaurant')
      .where('ord.hotel_id = :hotelId', { hotelId })
      .andWhere('ord.payment_status = :status', { status: PaymentStatus.PAID })
      .groupBy('ord.restaurant_id')
      .addGroupBy('restaurant.name')
      .getRawMany();

    // Today summary
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

    // Total revenue (paid only)
    const totalRevenue = await this.orderRepo
      .createQueryBuilder('ord')
      .select('SUM(ord.subtotal)', 'total')
      .where('ord.hotel_id = :hotelId', { hotelId })
      .andWhere('ord.payment_status = :status', { status: PaymentStatus.PAID })
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

  // ── REPORT: Restaurant-specific order summary ───────────────────────────────
  async getRestaurantOrderReport(restaurantId: string, userId: string) {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    await this.verifyHotelOwner(restaurant.hotel_id, userId);

    const orders = await this.orderRepo.find({
      where: { restaurant_id: restaurantId },
    });

    const paid = orders.filter((o) => o.payment_status === PaymentStatus.PAID);
    const pending = orders.filter(
      (o) => o.payment_status === PaymentStatus.PENDING,
    );

    return {
      total_orders: orders.length,
      paid_orders: paid.length,
      pending_orders: pending.length,
      total_revenue: paid.reduce((sum, o) => sum + Number(o.subtotal), 0),
      dine_in_orders: orders.filter((o) => o.category === OrderCategory.DINE_IN)
        .length,
      room_service_orders: orders.filter(
        (o) => o.category === OrderCategory.ROOM_SERVICE,
      ).length,
      takeaway_orders: orders.filter(
        (o) => o.category === OrderCategory.TAKEAWAY,
      ).length,
    };
  }
}
