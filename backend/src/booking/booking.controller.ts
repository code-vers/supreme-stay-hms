// src/booking/booking.controller.ts
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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // ── User: Booking create ────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBookingDto, @CurrentUser('userId') userId: string) {
    return this.bookingService.create(dto, userId);
  }

  // ── Owner:  bookings ─────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get()
  findAll(@Query() query: QueryBookingDto) {
    return this.bookingService.findAll(query);
  }

  // ── User:  bookings ───────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get('my-bookings')
  findMyBookings(
    @CurrentUser('userId') userId: string,
    @Query() query: QueryBookingDto,
  ) {
    return this.bookingService.findMyBookings(userId, query);
  }

  // ── Public: Room availability check ────────────────────────────────────────
  @Get('availability/:roomId')
  checkAvailability(
    @Param('roomId') roomId: string,
    @Query('check_in') checkIn: string,
    @Query('check_out') checkOut: string,
  ) {
    return this.bookingService.getRoomAvailability(roomId, checkIn, checkOut);
  }

  // ── Owner: Hotel booking report ─────────────────────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get('report/:hotelId')
  getReport(
    @Param('hotelId') hotelId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.bookingService.getHotelBookingReport(hotelId, userId);
  }

  // ── Single booking ──────────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  // ── Owner: Status + Payment update ─────────────────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.bookingService.update(id, dto, userId);
  }

  // ── User:  booking cancel ─────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Delete(':id/cancel')
  cancel(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Query('reason') reason?: string,
  ) {
    return this.bookingService.cancelBooking(id, userId, reason);
  }
}
