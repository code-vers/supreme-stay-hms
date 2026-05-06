import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @IsUUID()
  hotel_id: string;

  @IsInt()
  @Min(1)
  room_number: number;

  @IsString()
  @IsNotEmpty()
  room_type: string;

  @IsInt()
  @Min(0)
  floor: number;

  @IsOptional()
  @IsString()
  initial_status?: string;

  @IsInt()
  @Min(0)
  rate_per_night: number;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  room_amenities?: string[];

  @IsOptional()
  @IsString()
  room_description?: string;

  @IsString()
  @IsNotEmpty()
  font_image: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
