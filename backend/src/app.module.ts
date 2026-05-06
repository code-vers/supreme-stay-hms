import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { HotelsModule } from './hotels/hotels.module';
import { MenuItemModule } from './menu_items/menu_items.module';
import { Permission } from './permissions/entities/permission.entity';
import { RestaurantTableModule } from './restaurant-table/restaurant-table.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ReservationModule } from './restaurant_table_reservation/restaurant_table_reservation.module';

import { BookingModule } from './booking/booking.module';
import { MenuOrderItemModule } from './menu-order-item/menu-order-item.module';
import { Role } from './roles/entities/role.entity';
import { RoomModule } from './room/room.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { BillingsModule } from './billings/billings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        entities: [User, Role, Permission],
        synchronize: true,
        logging: config.get<string>('DB_LOGGING') === 'true',
        ssl: { rejectUnauthorized: false },
      }),
    }),
    UsersModule,
    AuthModule,
    HotelsModule,
    RoomModule,
    RestaurantModule,
    RestaurantTableModule,
    MenuItemModule,
    ReservationModule,
    MenuOrderItemModule,
    BookingModule,
    BillingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
