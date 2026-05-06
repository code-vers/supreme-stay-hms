// src/reservation/reservation.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user.role.enun';

import { CreateReservationDto } from './dto/create-restaurant_table_reservation.dto';
import { QueryReservationDto } from './dto/query-reservation.dto';
import { UpdateReservationDto } from './dto/update-restaurant_table_reservation.dto';
import { ReservationService } from './restaurant_table_reservation.service';

@Controller('table/reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateReservationDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.reservationService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get()
  findAll(@Query() query: QueryReservationDto) {
    return this.reservationService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-reservations')
  findMyReservations(
    @CurrentUser('userId') userId: string,
    @Query() query: QueryReservationDto,
  ) {
    return this.reservationService.findMyReservations(userId, query);
  }

  // ── Public: Table availability check ─
  @Get('availability/:tableId')
  checkAvailability(
    @Param('tableId') tableId: string,
    @Query('date') date: string,
    @Query('duration_minutes') durationMinutes?: string,
  ) {
    return this.reservationService.getTableAvailability(
      tableId,
      date,
      durationMinutes ? Number(durationMinutes) : 120,
    );
  }

  // ── Owner: Restaurant report ──
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get('report/:restaurantId')
  getReport(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.reservationService.getRestaurantReport(restaurantId, userId);
  }

  // ── Single reservation ────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  // ── Owner: Status update (pending→cooking→served→paid) ───────────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReservationDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.reservationService.updateStatus(id, dto, userId);
  }

  // ── User:  reservation cancel ───────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Delete(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.reservationService.cancelReservation(id, userId);
  }
}
