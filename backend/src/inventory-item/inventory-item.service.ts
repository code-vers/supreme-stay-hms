// src/inventory-item/inventory-item.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { QueryInventoryItemDto } from './dto/query-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryItem, ItemStatus } from './entities/inventory-item.entity';

@Injectable()
export class InventoryItemService {
  constructor(
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
    return hotel;
  }

  // Stock বাড়ানো বা কমানোর পরে status auto-update
  private resolveStatus(stock: number, threshold: number): ItemStatus {
    if (stock <= 0) return ItemStatus.OUT_OF_STOCK;
    if (stock <= threshold) return ItemStatus.LOW_STOCK;
    return ItemStatus.IN_STOCK;
  }

  async create(
    dto: CreateInventoryItemDto,
    userId: string,
  ): Promise<InventoryItem> {
    await this.verifyOwner(dto.hotel_id, userId);
    const threshold = dto.low_stock_threshold ?? 10;
    const status = this.resolveStatus(dto.current_stock, threshold);
    const item = this.itemRepo.create({
      ...dto,
      low_stock_threshold: threshold,
      status,
    });
    return this.itemRepo.save(item);
  }

  async findAll(query: QueryInventoryItemDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const qb = this.itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.supplier', 'supplier');

    if (query.hotel_id)
      qb.andWhere('item.hotel_id = :h', { h: query.hotel_id });
    if (query.suppliers_id)
      qb.andWhere('item.suppliers_id = :s', { s: query.suppliers_id });
    if (query.category)
      qb.andWhere('item.category = :c', { c: query.category });
    if (query.status) qb.andWhere('item.status = :st', { st: query.status });
    if (query.search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub.where('item.name ILIKE :search', { search: `%${query.search}%` });
        }),
      );
    }

    qb.orderBy('item.name', 'ASC').skip(skip).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<InventoryItem> {
    const item = await this.itemRepo.findOne({
      where: { id },
      relations: ['supplier', 'logs', 'purchases'],
    });
    if (!item) throw new NotFoundException('Inventory item not found');
    return item;
  }

  async update(
    id: string,
    dto: UpdateInventoryItemDto,
    userId: string,
  ): Promise<InventoryItem> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');
    await this.verifyOwner(item.hotel_id, userId);
    const updated = this.itemRepo.merge(item, dto);
    // Stock ya threshold değişirse status recalculate
    updated.status = this.resolveStatus(
      updated.current_stock,
      updated.low_stock_threshold,
    );
    return this.itemRepo.save(updated);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');
    await this.verifyOwner(item.hotel_id, userId);
    await this.itemRepo.remove(item);
    return { message: 'Inventory item deleted successfully' };
  }

  //
  async deductStock(
    itemId: string,
    quantity: number,
    userId: string,
  ): Promise<InventoryItem> {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Inventory item not found');
    await this.verifyOwner(item.hotel_id, userId);
    if (item.current_stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${item.current_stock}`,
      );
    }
    item.current_stock -= quantity;
    item.status = this.resolveStatus(
      item.current_stock,
      item.low_stock_threshold,
    );
    return this.itemRepo.save(item);
  }

  // Low stock alert list
  async getLowStockItems(hotelId: string, userId: string) {
    await this.verifyOwner(hotelId, userId);
    return this.itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.supplier', 'supplier')
      .where('item.hotel_id = :hotelId', { hotelId })
      .andWhere('item.status IN (:...statuses)', {
        statuses: [ItemStatus.LOW_STOCK, ItemStatus.OUT_OF_STOCK],
      })
      .orderBy('item.current_stock', 'ASC')
      .getMany();
  }
}
