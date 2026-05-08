import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { QueryHotelsDto } from './dto/query-hotels.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel } from './entities/hotel.entity';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepo: Repository<Hotel>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createHotelDto: CreateHotelDto,
    ownerId: string,
  ): Promise<Hotel> {
    let coverImageUrl = createHotelDto.cover_image;
    let galleryImageUrls = createHotelDto.gallery_images || [];

    // Upload cover image if provided
    if (createHotelDto.cover_image) {
      const coverUpload = await this.cloudinaryService.uploadImage(
        createHotelDto.cover_image,
        'supreme-stay/hotels/cover-images',
      );
      coverImageUrl = coverUpload.secureUrl;
    }

    // Upload gallery images if provided
    if (
      Array.isArray(createHotelDto.gallery_images) &&
      createHotelDto.gallery_images.length > 0
    ) {
      const uploadedUrls: string[] = [];
      for (const imageData of createHotelDto.gallery_images) {
        const galleryUpload = await this.cloudinaryService.uploadImage(
          imageData,
          'supreme-stay/hotels/gallery-images',
        );
        uploadedUrls.push(galleryUpload.secureUrl);
      }
      galleryImageUrls = uploadedUrls;
    }

    const saved = await this.hotelRepo.save({
      ...createHotelDto,
      cover_image: coverImageUrl,
      gallery_images: galleryImageUrls,
      owner_id: ownerId,
    });
    return saved;
  }

  async findAll(query: QueryHotelsDto, userId?: string) {
    console.log('🔍 findAll called with userId:', userId);
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const qb = this.hotelRepo.createQueryBuilder('hotel');

    if (userId) {
      console.log('🛡️ Filtering hotels for owner:', userId);
      qb.andWhere('hotel.owner_id = :userId', { userId });
    }

    if (query.city) {
      qb.andWhere('hotel.city ILIKE :city', { city: `%${query.city}%` });
    }

    if (query.country) {
      qb.andWhere('hotel.country ILIKE :country', {
        country: `%${query.country}%`,
      });
    }

    if (query.minRating) {
      qb.andWhere('hotel.default_rating >= :minRating', {
        minRating: Number(query.minRating),
      });
    }

    if (query.maxRating) {
      qb.andWhere('hotel.default_rating <= :maxRating', {
        maxRating: Number(query.maxRating),
      });
    }

    if (query.minRooms) {
      qb.andWhere('hotel.no_of_rooms >= :minRooms', {
        minRooms: Number(query.minRooms),
      });
    }

    if (query.maxRooms) {
      qb.andWhere('hotel.no_of_rooms <= :maxRooms', {
        maxRooms: Number(query.maxRooms),
      });
    }

    if (query.search) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb
            .where('hotel.hotel_name ILIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('hotel.tagline ILIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('hotel.address ILIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('hotel.city ILIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('hotel.country ILIKE :search', {
              search: `%${query.search}%`,
            });
        }),
      );
    }

    qb.orderBy('hotel.id', 'DESC').skip(skip).take(limit);

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

  async debugFindAll() {
    return this.hotelRepo.find();
  }

  async update(
    id: string,
    updateHotelDto: UpdateHotelDto,
    userId: string,
  ): Promise<Hotel> {
    const hotel = await this.hotelRepo.findOne({ where: { id } });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    if (hotel.owner_id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const updated = this.hotelRepo.merge(hotel, updateHotelDto);
    return this.hotelRepo.save(updated);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const hotel = await this.hotelRepo.findOne({ where: { id } });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    if (hotel.owner_id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    await this.hotelRepo.remove(hotel);
    return { message: 'Hotel deleted successfully' };
  }
}
