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
exports.MenuOrderItem = exports.PaymentStatus = exports.OrderCategory = void 0;
const hotel_entity_1 = require("../../hotels/entities/hotel.entity");
const menu_item_entity_1 = require("../../menu_items/entities/menu_item.entity");
const restaurant_table_entity_1 = require("../../restaurant-table/entities/restaurant-table.entity");
const restaurant_entity_1 = require("../../restaurant/entities/restaurant.entity");
const room_entity_1 = require("../../room/entities/room.entity");
const typeorm_1 = require("typeorm");
var OrderCategory;
(function (OrderCategory) {
    OrderCategory["DINE_IN"] = "dine_in";
    OrderCategory["ROOM_SERVICE"] = "room_service";
    OrderCategory["TAKEAWAY"] = "takeaway";
})(OrderCategory || (exports.OrderCategory = OrderCategory = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let MenuOrderItem = class MenuOrderItem {
    id;
    hotel_id;
    table_id;
    room_id;
    restaurant_id;
    menu_item_id;
    quantity;
    price;
    subtotal;
    note;
    payment_status;
    category;
    delivery_time;
    hotel;
    table;
    room;
    restaurant;
    menuItem;
    created_at;
    updated_at;
};
exports.MenuOrderItem = MenuOrderItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MenuOrderItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MenuOrderItem.prototype, "hotel_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], MenuOrderItem.prototype, "table_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], MenuOrderItem.prototype, "room_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MenuOrderItem.prototype, "restaurant_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MenuOrderItem.prototype, "menu_item_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], MenuOrderItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], MenuOrderItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], MenuOrderItem.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MenuOrderItem.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], MenuOrderItem.prototype, "payment_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: OrderCategory }),
    __metadata("design:type", String)
], MenuOrderItem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MenuOrderItem.prototype, "delivery_time", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hotel_entity_1.Hotel, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'hotel_id' }),
    __metadata("design:type", hotel_entity_1.Hotel)
], MenuOrderItem.prototype, "hotel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => restaurant_table_entity_1.RestaurantTable, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'table_id' }),
    __metadata("design:type", restaurant_table_entity_1.RestaurantTable)
], MenuOrderItem.prototype, "table", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'room_id' }),
    __metadata("design:type", room_entity_1.Room)
], MenuOrderItem.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => restaurant_entity_1.Restaurant, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'restaurant_id' }),
    __metadata("design:type", restaurant_entity_1.Restaurant)
], MenuOrderItem.prototype, "restaurant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_item_entity_1.MenuItem, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'menu_item_id' }),
    __metadata("design:type", menu_item_entity_1.MenuItem)
], MenuOrderItem.prototype, "menuItem", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MenuOrderItem.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MenuOrderItem.prototype, "updated_at", void 0);
exports.MenuOrderItem = MenuOrderItem = __decorate([
    (0, typeorm_1.Entity)('menu_order_items')
], MenuOrderItem);
//# sourceMappingURL=menu-order-item.entity.js.map