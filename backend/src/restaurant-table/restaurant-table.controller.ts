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
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { QueryRestaurantTableDto } from './dto/query-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import { RestaurantTableService } from './restaurant-table.service';

@Controller('restaurant-tables')
export class RestaurantTableController {
  constructor(
    private readonly restaurantTableService: RestaurantTableService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Post()
  create(
    @Body() createRestaurantTableDto: CreateRestaurantTableDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.restaurantTableService.create(createRestaurantTableDto, userId);
  }

  @Get()
  findAll(@Query() query: QueryRestaurantTableDto) {
    return this.restaurantTableService.findAll(query);
  }

  @Get('restaurant/:restaurantId')
  findByRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Query() query: QueryRestaurantTableDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.restaurantTableService.findByRestaurantId(restaurantId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantTableService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantTableDto: UpdateRestaurantTableDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.restaurantTableService.update(
      id,
      updateRestaurantTableDto,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROPERTY_OWNER)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.restaurantTableService.remove(id, userId);
  }
}
