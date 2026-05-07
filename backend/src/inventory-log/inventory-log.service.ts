// src/inventory-log/inventory-log.service.ts
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
import { Repository } from 'typeorm';
import { CreateInventoryLogDto } from './dto/create-inventory-log.dto';
import { QueryInventoryLogDto } from './dto/query-inventory-log.dto';
import { InventoryLog, LogType } from './entities/inventory-log.entity';

@Injectable()
export class InventoryLogService {
  constructor(
    @InjectRepository(InventoryLog)
    private readonly logRepo: Repository<InventoryLog>,
    @InjectRepository(InventoryItem)
    private readonly itemRepo: Repository<InventoryItem>,
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

  // Log create + stock auto-update
  async create(
    dto: CreateInventoryLogDto,
    userId: string,
  ): Promise<InventoryLog> {
    const item = await this.itemRepo.findOne({ where: { id: dto.item_id } });
    if (!item) throw new NotFoundException('Inventory item not found');

    await this.verifyOwner(item.hotel_id, userId);

    // Usage / wastage এ quantity negative হতে হবে
    if (
      (dto.type === LogType.USAGE || dto.type === LogType.WASTAGE) &&
      dto.quantity > 0
    ) {
      throw new BadRequestException(
        `Quantity must be negative for ${dto.type}. E.g., -5`,
      );
    }

    // Purchase / positive adjustment এ positive হতে হবে
    if (dto.type === LogType.PURCHASE && dto.quantity <= 0) {
      throw new BadRequestException('Quantity must be positive for purchase');
    }

    // Stock চেক — কমানোর সময়
    const newStock = item.current_stock + dto.quantity;
    if (newStock < 0) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${item.current_stock}, Requested: ${Math.abs(dto.quantity)}`,
      );
    }

    // Stock update
    item.current_stock = newStock;
    item.status = this.resolveStatus(newStock, item.low_stock_threshold);
    await this.itemRepo.save(item);

    // Log save
    const log = this.logRepo.create(dto);
    return this.logRepo.save(log);
  }

  async findAll(query: QueryInventoryLogDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const qb = this.logRepo
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.item', 'item');

    if (query.item_id)
      qb.andWhere('log.item_id = :itemId', { itemId: query.item_id });
    if (query.type) qb.andWhere('log.type = :type', { type: query.type });
    if (query.hotel_id)
      qb.andWhere('item.hotel_id = :hotelId', { hotelId: query.hotel_id });
    if (query.date_from) {
      qb.andWhere('log.created_at >= :dateFrom', {
        dateFrom: new Date(query.date_from),
      });
    }
    if (query.date_to) {
      qb.andWhere('log.created_at <= :dateTo', {
        dateTo: new Date(query.date_to),
      });
    }

    qb.orderBy('log.created_at', 'DESC').skip(skip).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<InventoryLog> {
    const log = await this.logRepo.findOne({
      where: { id },
      relations: ['item'],
    });
    if (!log) throw new NotFoundException('Log not found');
    return log;
  }

  // Item এর full history
  async getItemHistory(itemId: string, userId: string) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Item not found');
    await this.verifyOwner(item.hotel_id, userId);

    const logs = await this.logRepo
      .createQueryBuilder('log')
      .where('log.item_id = :itemId', { itemId })
      .orderBy('log.created_at', 'DESC')
      .getMany();

    // Type-wise summary
    const summary = {
      total_purchased: logs
        .filter((l) => l.type === LogType.PURCHASE)
        .reduce((sum, l) => sum + l.quantity, 0),
      total_used: logs
        .filter((l) => l.type === LogType.USAGE)
        .reduce((sum, l) => sum + Math.abs(l.quantity), 0),
      total_wasted: logs
        .filter((l) => l.type === LogType.WASTAGE)
        .reduce((sum, l) => sum + Math.abs(l.quantity), 0),
      current_stock: item.current_stock,
    };

    return { item, summary, logs };
  }
}
