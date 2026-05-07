// src/purchase-item/purchase-item.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import {
  InventoryItem,
  ItemStatus,
} from 'src/inventory-item/entities/inventory-item.entity';
import {
  InventoryLog,
  LogType,
} from 'src/inventory-log/entities/inventory-log.entity';
import { Repository } from 'typeorm';
import { CreatePurchaseItemDto } from './dto/create-purchase-item.dto';
import { QueryPurchaseItemDto } from './dto/query-purchase-item.dto';
import { UpdatePurchaseItemDto } from './dto/update-purchase-item.dto';
import { PurchaseItem, PurchaseStatus } from './entities/purchase-item.entity';

@Injectable()
export class PurchaseItemService {
  constructor(
    @InjectRepository(PurchaseItem)
    private readonly purchaseRepo: Repository<PurchaseItem>,
    @InjectRepository(InventoryItem)
    private readonly itemRepo: Repository<InventoryItem>,
    @InjectRepository(InventoryLog)
    private readonly logRepo: Repository<InventoryLog>,
    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,
  ) {}

  private async verifyOwner(hotelId: string, userId: string) {
    const hotel = await this.hotelRepo.findOne({ where: { id: hotelId } });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.owner_id !== userId)
      throw new UnauthorizedException('Unauthorized');
  }

  private resolveStatus(stock: number, threshold: number): ItemStatus {
    if (stock <= 0) return ItemStatus.OUT_OF_STOCK;
    if (stock <= threshold) return ItemStatus.LOW_STOCK;
    return ItemStatus.IN_STOCK;
  }

  async create(
    dto: CreatePurchaseItemDto,
    userId: string,
  ): Promise<PurchaseItem> {
    await this.verifyOwner(dto.hotel_id, userId);

    const item = await this.itemRepo.findOne({ where: { id: dto.item_id } });
    if (!item) throw new NotFoundException('Inventory item not found');

    // Subtotal validation
    const expected = dto.quantity * dto.cost_price;
    if (Math.abs(expected - dto.subtotal) > 0.01) {
      throw new BadRequestException(
        `subtotal mismatch: expected ${expected}, got ${dto.subtotal}`,
      );
    }

    const purchase = this.purchaseRepo.create({
      ...dto,
      status: PurchaseStatus.PENDING,
    });
    return this.purchaseRepo.save(purchase);
  }

  async findAll(query: QueryPurchaseItemDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const qb = this.purchaseRepo
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.item', 'item')
      .leftJoinAndSelect('purchase.supplier', 'supplier');

    if (query.hotel_id)
      qb.andWhere('purchase.hotel_id = :h', { h: query.hotel_id });
    if (query.item_id)
      qb.andWhere('purchase.item_id = :i', { i: query.item_id });
    if (query.supplier_id)
      qb.andWhere('purchase.supplier_id = :s', { s: query.supplier_id });
    if (query.status)
      qb.andWhere('purchase.status = :st', { st: query.status });
    if (query.date_from) {
      qb.andWhere('purchase.created_at >= :df', {
        df: new Date(query.date_from),
      });
    }
    if (query.date_to) {
      qb.andWhere('purchase.created_at <= :dt', {
        dt: new Date(query.date_to),
      });
    }

    qb.orderBy('purchase.created_at', 'DESC').skip(skip).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<PurchaseItem> {
    const purchase = await this.purchaseRepo.findOne({
      where: { id },
      relations: ['item', 'supplier', 'hotel'],
    });
    if (!purchase) throw new NotFoundException('Purchase not found');
    return purchase;
  }

  // ── KEY: Purchase received হলে stock auto-update + log ──────────────────
  async updateStatus(
    id: string,
    dto: UpdatePurchaseItemDto,
    userId: string,
  ): Promise<PurchaseItem> {
    const purchase = await this.purchaseRepo.findOne({ where: { id } });
    if (!purchase) throw new NotFoundException('Purchase not found');

    await this.verifyOwner(purchase.hotel_id, userId);

    if (purchase.status === PurchaseStatus.RECEIVED) {
      throw new BadRequestException('Purchase already received');
    }
    if (purchase.status === PurchaseStatus.CANCELLED) {
      throw new BadRequestException('Cancelled purchase cannot be updated');
    }

    // RECEIVED হলে — stock বাড়াও + log তৈরি করো
    if (dto.status === PurchaseStatus.RECEIVED) {
      const item = await this.itemRepo.findOne({
        where: { id: purchase.item_id },
      });
      if (!item) throw new NotFoundException('Inventory item not found');

      // Stock update
      item.current_stock += purchase.quantity;
      item.status = this.resolveStatus(
        item.current_stock,
        item.low_stock_threshold,
      );
      await this.itemRepo.save(item);

      // Auto inventory log
      await this.logRepo.save(
        this.logRepo.create({
          item_id: purchase.item_id,
          type: LogType.PURCHASE,
          quantity: purchase.quantity,
          reference_id: purchase.id,
          note: `Purchase received — Order #${purchase.id}`,
        }),
      );

      purchase.received_at = new Date();
    }

    const updated = this.purchaseRepo.merge(purchase, dto);
    return this.purchaseRepo.save(updated);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const purchase = await this.purchaseRepo.findOne({ where: { id } });
    if (!purchase) throw new NotFoundException('Purchase not found');
    await this.verifyOwner(purchase.hotel_id, userId);

    if (purchase.status === PurchaseStatus.RECEIVED) {
      throw new BadRequestException('Received purchases cannot be deleted');
    }

    await this.purchaseRepo.remove(purchase);
    return { message: 'Purchase deleted successfully' };
  }

  // Purchase report per hotel
  async getPurchaseReport(hotelId: string, userId: string) {
    await this.verifyOwner(hotelId, userId);

    const statusBreakdown = await this.purchaseRepo
      .createQueryBuilder('p')
      .select('p.status', 'status')
      .addSelect('COUNT(p.id)', 'count')
      .addSelect('SUM(p.total_amount)', 'total')
      .where('p.hotel_id = :hotelId', { hotelId })
      .groupBy('p.status')
      .getRawMany();

    const topItems = await this.purchaseRepo
      .createQueryBuilder('p')
      .select('p.item_id', 'item_id')
      .addSelect('item.name', 'item_name')
      .addSelect('SUM(p.quantity)', 'total_qty')
      .addSelect('SUM(p.total_amount)', 'total_spent')
      .leftJoin('p.item', 'item')
      .where('p.hotel_id = :hotelId', { hotelId })
      .andWhere('p.status = :status', { status: PurchaseStatus.RECEIVED })
      .groupBy('p.item_id')
      .addGroupBy('item.name')
      .orderBy('total_spent', 'DESC')
      .limit(5)
      .getRawMany();

    const monthlySpend = await this.purchaseRepo
      .createQueryBuilder('p')
      .select("TO_CHAR(p.created_at, 'YYYY-MM')", 'month')
      .addSelect('SUM(p.total_amount)', 'total_spent')
      .where('p.hotel_id = :hotelId', { hotelId })
      .andWhere('p.status = :status', { status: PurchaseStatus.RECEIVED })
      .andWhere("p.created_at >= NOW() - INTERVAL '6 months'")
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return {
      status_breakdown: statusBreakdown,
      top_items: topItems,
      monthly_spend: monthlySpend,
    };
  }
}
