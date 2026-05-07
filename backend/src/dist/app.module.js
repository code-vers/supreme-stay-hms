"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const hotels_module_1 = require("./hotels/hotels.module");
const menu_items_module_1 = require("./menu_items/menu_items.module");
const permission_entity_1 = require("./permissions/entities/permission.entity");
const restaurant_table_module_1 = require("./restaurant-table/restaurant-table.module");
const restaurant_module_1 = require("./restaurant/restaurant.module");
const restaurant_table_reservation_module_1 = require("./restaurant_table_reservation/restaurant_table_reservation.module");
const billing_entity_1 = require("./billings/entities/billing.entity");
const booking_module_1 = require("./booking/booking.module");
const menu_order_item_module_1 = require("./menu-order-item/menu-order-item.module");
const role_entity_1 = require("./roles/entities/role.entity");
const room_module_1 = require("./room/room.module");
const user_entity_1 = require("./users/entities/user.entity");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    url: config.get('DATABASE_URL'),
                    autoLoadEntities: true,
                    entities: [user_entity_1.User, role_entity_1.Role, permission_entity_1.Permission],
                    synchronize: true,
                    logging: config.get('DB_LOGGING') === 'true',
                    ssl: { rejectUnauthorized: false },
                }),
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            hotels_module_1.HotelsModule,
            room_module_1.RoomModule,
            restaurant_module_1.RestaurantModule,
            restaurant_table_module_1.RestaurantTableModule,
            menu_items_module_1.MenuItemModule,
            restaurant_table_reservation_module_1.ReservationModule,
            menu_order_item_module_1.MenuOrderItemModule,
            booking_module_1.BookingModule,
            billing_entity_1.Billing,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: 'APP_FILTER',
                useClass: http_exception_filter_1.GlobalExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map