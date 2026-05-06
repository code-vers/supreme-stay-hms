// src/menu-item/menu-item.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Brackets, Repository } from 'typeorm';

import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { QueryMenuItemDto } from './dto/query-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { MenuItem } from './entities/menu_item.entity';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,

    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
  ) {}

  // Restaurant ownership check — hotel owner-er moto same pattern
  private async verifyRestaurantOwner(
    restaurantId: string,
    userId: string,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId },
      relations: ['hotel'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Restaurant entity-te owner_id thakle direct check,
    // nahole hotel-er owner_id diye check
    if (restaurant.hotel?.owner_id !== userId) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }

    return restaurant;
  }

  async create(
    createMenuItemDto: CreateMenuItemDto,
    userId: string,
  ): Promise<MenuItem> {
    await this.verifyRestaurantOwner(createMenuItemDto.restaurant_id, userId);

    const menuItem = this.menuItemRepo.create({
      ...createMenuItemDto,
      is_available: createMenuItemDto.is_available ?? true,
    });

    return this.menuItemRepo.save(menuItem);
  }

  async findAll(restaurantId: string, query: QueryMenuItemDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    // Restaurant exists check
    const restaurantExists = await this.restaurantRepo.findOne({
      where: { id: restaurantId },
    });
    if (!restaurantExists) {
      throw new NotFoundException('Restaurant not found');
    }

    const qb = this.menuItemRepo
      .createQueryBuilder('item')
      .where('item.restaurant_id = :restaurantId', { restaurantId });

    if (query.search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('item.name ILIKE :search', { search: `%${query.search}%` })
            .orWhere('item.description ILIKE :search', {
              search: `%${query.search}%`,
            });
        }),
      );
    }

    if (query.is_available !== undefined) {
      qb.andWhere('item.is_available = :is_available', {
        is_available: query.is_available === 'true',
      });
    }

    if (query.minPrice) {
      qb.andWhere('item.price >= :minPrice', {
        minPrice: Number(query.minPrice),
      });
    }

    if (query.maxPrice) {
      qb.andWhere('item.price <= :maxPrice', {
        maxPrice: Number(query.maxPrice),
      });
    }

    qb.orderBy('item.name', 'ASC').skip(skip).take(limit);

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

  async findOne(id: string): Promise<MenuItem> {
    const item = await this.menuItemRepo.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return item;
  }

  async update(
    id: string,
    updateMenuItemDto: UpdateMenuItemDto,
    userId: string,
  ): Promise<MenuItem> {
    const item = await this.menuItemRepo.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    await this.verifyRestaurantOwner(item.restaurant_id, userId);

    const updated = this.menuItemRepo.merge(item, updateMenuItemDto);
    return this.menuItemRepo.save(updated);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const item = await this.menuItemRepo.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    await this.verifyRestaurantOwner(item.restaurant_id, userId);

    await this.menuItemRepo.remove(item);
    return { message: 'Menu item deleted successfully' };
  }
}
