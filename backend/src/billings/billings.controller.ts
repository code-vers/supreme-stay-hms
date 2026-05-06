// src/billing/billing.controller.ts
import {
  Body,
  Controller,
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

import { CreateBillingDto } from './dto/create-billing.dto';
import { QueryBillingDto } from './dto/query-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { BillingService } from './billings.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  // ── User: Bill generate  ──────────────
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBillingDto, @CurrentUser('userId') userId: string) {
    return this.billingService.create(dto, userId);
  }

  // ── Owner:  bills ─────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get()
  findAll(@Query() query: QueryBillingDto) {
    return this.billingService.findAll(query);
  }

  // ── User:  bills ────────────────
  @UseGuards(JwtAuthGuard)
  @Get('my-bills')
  findMyBillings(
    @CurrentUser('userId') userId: string,
    @Query() query: QueryBillingDto,
  ) {
    return this.billingService.findMyBillings(userId, query);
  }

  // ── Owner: Hotel billing report ────────────────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Get('report/:hotelId')
  getReport(
    @Param('hotelId') hotelId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.billingService.getHotelBillingReport(hotelId, userId);
  }

  // ── Single bill ────────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(id);
  }

  // ── Owner: Payment status update (card/online confirm) ─────────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBillingDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.billingService.update(id, dto, userId);
  }
}
