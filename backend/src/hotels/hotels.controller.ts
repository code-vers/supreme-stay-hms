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
import { CreateHotelDto } from './dto/create-hotel.dto';
import { QueryHotelsDto } from './dto/query-hotels.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelsService } from './hotels.service';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Post()
  create(
    @Body() createHotelDto: CreateHotelDto,
    @CurrentUser('userId') userId: string,
  ) {
    console.log("📥 Creating hotel with userId:", userId, "Payload:", createHotelDto);
    return this.hotelsService.create(createHotelDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query() query: QueryHotelsDto,
    @CurrentUser('userId') userId?: string,
  ) {
    return this.hotelsService.findAll(query, userId);
  }

  @Get('debug-all')
  debugAll() {
    return this.hotelsService.debugFindAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.hotelsService.update(id, updateHotelDto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.hotelsService.remove(id, userId);
  }
}
