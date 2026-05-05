import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { QueryRestaurantTableDto } from './dto/query-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import { RestaurantTable } from './entities/restaurant-table.entity';

@Injectable()
export class RestaurantTableService {
  constructor(
    @InjectRepository(RestaurantTable)
    private readonly tableRepo: Repository<RestaurantTable>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,
  ) {}

  async create(
    dto: CreateRestaurantTableDto,
    userId: string,
  ): Promise<RestaurantTable> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: dto.restaurant_id },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const hotel = await this.hotelRepo.findOne({
      where: { id: restaurant.hotel_id },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.owner_id !== userId)
      throw new UnauthorizedException('Unauthorized');

    const table = this.tableRepo.create(dto);
    return this.tableRepo.save(table);
  }

  async findAll(query: QueryRestaurantTableDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const qb = this.tableRepo.createQueryBuilder('table');

    if (query.restaurant_id) {
      qb.andWhere('table.restaurant_id = :restaurantId', {
        restaurantId: query.restaurant_id,
      });
    }
    if (query.status) {
      qb.andWhere('table.status ILIKE :status', {
        status: `%${query.status}%`,
      });
    }
    if (query.minCapacity) {
      qb.andWhere('table.capacity >= :minCapacity', {
        minCapacity: Number(query.minCapacity),
      });
    }
    if (query.maxCapacity) {
      qb.andWhere('table.capacity <= :maxCapacity', {
        maxCapacity: Number(query.maxCapacity),
      });
    }
    if (query.search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('CAST(table.table_number AS TEXT) ILIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('table.status ILIKE :search', {
              search: `%${query.search}%`,
            });
        }),
      );
    }

    qb.orderBy('table.table_number', 'ASC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<RestaurantTable> {
    const table = await this.tableRepo.findOne({ where: { id } });
    if (!table) throw new NotFoundException('Restaurant table not found');
    return table;
  }

  async update(
    id: string,
    dto: UpdateRestaurantTableDto,
    userId: string,
  ): Promise<RestaurantTable> {
    const table = await this.tableRepo.findOne({ where: { id } });
    if (!table) throw new NotFoundException('Restaurant table not found');

    const targetRestaurantId = dto.restaurant_id ?? table.restaurant_id;
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: targetRestaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const hotel = await this.hotelRepo.findOne({
      where: { id: restaurant.hotel_id },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.owner_id !== userId)
      throw new UnauthorizedException('Unauthorized');

    const updated = this.tableRepo.merge(table, dto);
    return this.tableRepo.save(updated);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const table = await this.tableRepo.findOne({ where: { id } });
    if (!table) throw new NotFoundException('Restaurant table not found');

    const restaurant = await this.restaurantRepo.findOne({
      where: { id: table.restaurant_id },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const hotel = await this.hotelRepo.findOne({
      where: { id: restaurant.hotel_id },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.owner_id !== userId)
      throw new UnauthorizedException('Unauthorized');

    await this.tableRepo.remove(table);
    return { message: 'Restaurant table deleted successfully' };
  }
}
