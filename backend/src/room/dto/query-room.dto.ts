import { IsOptional, IsString } from 'class-validator';

export class QueryRoomDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  hotel_id?: string;

  @IsOptional()
  @IsString()
  room_type?: string;

  @IsOptional()
  @IsString()
  initial_status?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
