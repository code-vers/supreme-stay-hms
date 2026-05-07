"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuOrderItemModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hotel_entity_1 = require("../hotels/entities/hotel.entity");
const restaurant_table_entity_1 = require("../restaurant-table/entities/restaurant-table.entity");
const restaurant_entity_1 = require("../restaurant/entities/restaurant.entity");
const room_entity_1 = require("../room/entities/room.entity");
const menu_order_item_entity_1 = require("./entities/menu-order-item.entity");
const menu_order_item_controller_1 = require("./menu-order-item.controller");
const menu_order_item_service_1 = require("./menu-order-item.service");
const menu_item_entity_1 = require("../menu_items/entities/menu_item.entity");
let MenuOrderItemModule = class MenuOrderItemModule {
};
exports.MenuOrderItemModule = MenuOrderItemModule;
exports.MenuOrderItemModule = MenuOrderItemModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                menu_order_item_entity_1.MenuOrderItem,
                hotel_entity_1.Hotel,
                room_entity_1.Room,
                restaurant_entity_1.Restaurant,
                restaurant_table_entity_1.RestaurantTable,
                menu_item_entity_1.MenuItem,
            ]),
        ],
        controllers: [menu_order_item_controller_1.MenuOrderItemController],
        providers: [menu_order_item_service_1.MenuOrderItemService],
    })
], MenuOrderItemModule);
//# sourceMappingURL=menu-order-item.module.js.map