"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("../booking/entities/booking.entity");
const hotel_entity_1 = require("../hotels/entities/hotel.entity");
const menu_order_item_entity_1 = require("../menu-order-item/entities/menu-order-item.entity");
const room_entity_1 = require("../room/entities/room.entity");
const billing_entity_1 = require("./entities/billing.entity");
const restaurant_table_reservation_entity_1 = require("../restaurant_table_reservation/entities/restaurant_table_reservation.entity");
const billings_controller_1 = require("./billings.controller");
const billings_service_1 = require("./billings.service");
let BillingModule = class BillingModule {
};
exports.BillingModule = BillingModule;
exports.BillingModule = BillingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                billing_entity_1.Billing,
                hotel_entity_1.Hotel,
                room_entity_1.Room,
                booking_entity_1.Booking,
                menu_order_item_entity_1.MenuOrderItem,
                restaurant_table_reservation_entity_1.Reservation,
            ]),
        ],
        controllers: [billings_controller_1.BillingController],
        providers: [billings_service_1.BillingService],
    })
], BillingModule);
//# sourceMappingURL=billings.module.js.map