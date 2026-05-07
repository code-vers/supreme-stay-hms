"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hotel_entity_1 = require("../hotels/entities/hotel.entity");
const restaurant_table_entity_1 = require("../restaurant-table/entities/restaurant-table.entity");
const restaurant_entity_1 = require("../restaurant/entities/restaurant.entity");
const restaurant_table_reservation_entity_1 = require("./entities/restaurant_table_reservation.entity");
const restaurant_table_reservation_controller_1 = require("./restaurant_table_reservation.controller");
const restaurant_table_reservation_service_1 = require("./restaurant_table_reservation.service");
let ReservationModule = class ReservationModule {
};
exports.ReservationModule = ReservationModule;
exports.ReservationModule = ReservationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([restaurant_table_reservation_entity_1.Reservation, restaurant_table_entity_1.RestaurantTable, restaurant_entity_1.Restaurant, hotel_entity_1.Hotel]),
        ],
        controllers: [restaurant_table_reservation_controller_1.ReservationController],
        providers: [restaurant_table_reservation_service_1.ReservationService],
    })
], ReservationModule);
//# sourceMappingURL=restaurant_table_reservation.module.js.map