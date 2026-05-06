// src/reservation/dto/update-reservation.dto.ts
import { IsEnum, IsOptional } from 'class-validator';
import { ReservationStatus } from '../entities/restaurant_table_reservation.entity';

// Full update allow na kore shudhu status + limited fields update
export class UpdateReservationDto {
  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;

  @IsOptional()
  special_request?: string;

  @IsOptional()
  guest_count?: number;

  @IsOptional()
  check_in_time?: Date;

  @IsOptional()
  check_out_time?: Date;
}
