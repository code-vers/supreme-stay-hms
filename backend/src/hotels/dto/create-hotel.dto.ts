import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  hotel_name: string;

  @IsNumber()
  @IsOptional()
  default_rating?: number;

  @IsString()
  @IsOptional()
  tagline?: string;

  @IsString()
  @IsNotEmpty()
  cover_image: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNumber()
  postal_code: number;

  @IsString()
  @IsNotEmpty()
  hotel_phone: string;

  @IsString()
  @IsNotEmpty()
  reservation_phone: string;

  @IsEmail()
  hotel_email: string;

  @IsString()
  @IsOptional()
  hotel_website?: string;

  @IsNumber()
  no_of_rooms: number;

  @IsNumber()
  no_of_floors: number;

  @IsString()
  @IsOptional()
  hotel_desc?: string;

  @IsArray()
  @IsOptional()
  hotel_amenities?: string[];

  @IsArray()
  @IsOptional()
  gallery_images?: string[];

  @IsString()
  @IsOptional()
  room_id?: string;
}
