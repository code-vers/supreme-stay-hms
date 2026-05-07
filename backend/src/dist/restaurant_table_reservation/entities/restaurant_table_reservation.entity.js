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
exports.Reservation = exports.ReservationStatus = exports.OrderType = void 0;
const restaurant_table_entity_1 = require("../../restaurant-table/entities/restaurant-table.entity");
const restaurant_entity_1 = require("../../restaurant/entities/restaurant.entity");
const typeorm_1 = require("typeorm");
var OrderType;
(function (OrderType) {
    OrderType["DINE_IN"] = "dine_in";
    OrderType["TAKEAWAY"] = "takeaway";
    OrderType["ROOM_SERVICE"] = "room_service";
})(OrderType || (exports.OrderType = OrderType = {}));
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["PENDING"] = "pending";
    ReservationStatus["COOKING"] = "cooking";
    ReservationStatus["SERVED"] = "served";
    ReservationStatus["PAID"] = "paid";
    ReservationStatus["CANCELLED"] = "cancelled";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
let Reservation = class Reservation {
    id;
    user_id;
    restaurant_id;
    table_id;
    order_type;
    status;
    total_amount;
    discount;
    grand_total;
    order_by;
    reservation_date;
    check_in_time;
    check_out_time;
    booking_duration_minutes;
    special_request;
    guest_count;
    restaurant;
    table;
    created_at;
    updated_at;
};
exports.Reservation = Reservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Reservation.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Reservation.prototype, "restaurant_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Reservation.prototype, "table_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: OrderType }),
    __metadata("design:type", String)
], Reservation.prototype, "order_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReservationStatus,
        default: ReservationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Reservation.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Reservation.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Reservation.prototype, "grand_total", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reservation.prototype, "order_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Reservation.prototype, "reservation_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Reservation.prototype, "check_in_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Reservation.prototype, "check_out_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 120 }),
    __metadata("design:type", Number)
], Reservation.prototype, "booking_duration_minutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "special_request", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Reservation.prototype, "guest_count", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => restaurant_entity_1.Restaurant, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'restaurant_id' }),
    __metadata("design:type", restaurant_entity_1.Restaurant)
], Reservation.prototype, "restaurant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => restaurant_table_entity_1.RestaurantTable, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'table_id' }),
    __metadata("design:type", restaurant_table_entity_1.RestaurantTable)
], Reservation.prototype, "table", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Reservation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Reservation.prototype, "updated_at", void 0);
exports.Reservation = Reservation = __decorate([
    (0, typeorm_1.Entity)('restaurant_table_reservation')
], Reservation);
//# sourceMappingURL=restaurant_table_reservation.entity.js.map