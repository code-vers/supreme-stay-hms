// src/supplier/supplier.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { QuerySupplierDto } from './dto/query-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
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

  async create(dto: CreateSupplierDto, userId: string): Promise<Supplier> {
    await this.verifyOwner(dto.hotel_id, userId);
    return this.supplierRepo.save(this.supplierRepo.create(dto));
  }

  async findAll(query: QuerySupplierDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const qb = this.supplierRepo.createQueryBuilder('supplier');

    if (query.hotel_id) {
      qb.andWhere('supplier.hotel_id = :hotelId', { hotelId: query.hotel_id });
    }
    if (query.search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('supplier.name ILIKE :s', { s: `%${query.search}%` })
            .orWhere('supplier.email ILIKE :s', { s: `%${query.search}%` })
            .orWhere('supplier.phone ILIKE :s', { s: `%${query.search}%` });
        }),
      );
    }

    qb.orderBy('supplier.created_at', 'DESC').skip(skip).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepo.findOne({
      where: { id },
      relations: ['inventoryItems'],
    });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async update(
    id: string,
    dto: UpdateSupplierDto,
    userId: string,
  ): Promise<Supplier> {
    const supplier = await this.supplierRepo.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    await this.verifyOwner(supplier.hotel_id, userId);
    return this.supplierRepo.save(this.supplierRepo.merge(supplier, dto));
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const supplier = await this.supplierRepo.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    await this.verifyOwner(supplier.hotel_id, userId);
    await this.supplierRepo.remove(supplier);
    return { message: 'Supplier deleted successfully' };
  }
}
