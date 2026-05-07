"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = exports.RestaurantStatus = exports.RestaurantType = void 0;
const typeorm_1 = require("typeorm");
const hotel_entity_1 = require("../../hotels/entities/hotel.entity");
const menu_item_entity_1 = require("../../menu_items/entities/menu_item.entity");
const restaurant_table_entity_1 = require("../../restaurant-table/entities/restaurant-table.entity");
var RestaurantType;
(function (RestaurantType) {
    RestaurantType["RESTAURANT"] = "restaurant";
    RestaurantType["BAR"] = "bar";
    RestaurantType["CAFE"] = "cafe";
    RestaurantType["SPA"] = "spa";
})(RestaurantType || (exports.RestaurantType = RestaurantType = {}));
var RestaurantStatus;
(function (RestaurantStatus) {
    RestaurantStatus["ACTIVE"] = "active";
    RestaurantStatus["INACTIVE"] = "inactive";
})(RestaurantStatus || (exports.RestaurantStatus = RestaurantStatus = {}));
let Restaurant = class Restaurant {
    id;
    hotel_id;
    hotel;
    name;
    type;
    status;
    tables;
    menuItems;
};
exports.Restaurant = Restaurant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Restaurant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Restaurant.prototype, "hotel_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hotel_entity_1.Hotel, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'hotel_id' }),
    __metadata("design:type", hotel_entity_1.Hotel)
], Restaurant.prototype, "hotel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RestaurantType }),
    __metadata("design:type", String)
], Restaurant.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RestaurantStatus }),
    __metadata("design:type", String)
], Restaurant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => restaurant_table_entity_1.RestaurantTable, (table) => table.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "tables", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_item_entity_1.MenuItem, (menuItem) => menuItem.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "menuItems", void 0);
exports.Restaurant = Restaurant = __decorate([
    (0, typeorm_1.Entity)('restaurant')
], Restaurant);
//# sourceMappingURL=restaurant.entity.js.map