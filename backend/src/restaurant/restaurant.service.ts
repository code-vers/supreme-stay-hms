import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { QueryRestaurantDto } from './dto/query-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,
  ) {}

  async create(
    createRestaurantDto: CreateRestaurantDto,
    userId: string,
  ): Promise<Restaurant> {
    const hotel = await this.hotelRepo.findOne({
      where: { id: createRestaurantDto.hotel_id },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.owner_id !== userId)
      throw new UnauthorizedException('Unauthorized');

    const restaurant = this.restaurantRepo.create(createRestaurantDto);
    return this.restaurantRepo.save(restaurant);
  }

  async findAll(query: QueryRestaurantDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const qb = this.restaurantRepo.createQueryBuilder('restaurant');
    if (query.hotel_id) {
      qb.andWhere('restaurant.hotel_id = :hotelId', {
        hotelId: query.hotel_id,
      });
    }
    if (query.type) {
      qb.andWhere('restaurant.type ILIKE :type', { type: `%${query.type}%` });
    }
    if (query.status) {
      qb.andWhere('restaurant.status ILIKE :status', {
        status: `%${query.status}%`,
      });
    }
    if (query.search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('restaurant.name ILIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('restaurant.type ILIKE :search', {
              search: `%${query.search}%`,
            });
        }),
      );
    }

    qb.orderBy('restaurant.name', 'ASC').skip(skip).take(limit);

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

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
    userId: string,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const targetHotelId = updateRestaurantDto.hotel_id ?? restaurant.hotel_id;
    const hotel = await this.hotelRepo.findOne({
      where: { id: targetHotelId },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.owner_id !== userId)
      throw new UnauthorizedException('Unauthorized');

    const updated = this.restaurantRepo.merge(restaurant, updateRestaurantDto);
    return this.restaurantRepo.save(updated);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const hotel = await this.hotelRepo.findOne({
      where: { id: restaurant.hotel_id },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    if (hotel.owner_id !== userId)
      throw new UnauthorizedException('Unauthorized');

    await this.restaurantRepo.remove(restaurant);
    return { message: 'Restaurant deleted successfully' };
  }
}
