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
exports.Billing = exports.BillingStatus = exports.PaymentMethod = exports.BillingType = void 0;
const booking_entity_1 = require("../../booking/entities/booking.entity");
const hotel_entity_1 = require("../../hotels/entities/hotel.entity");
const menu_order_item_entity_1 = require("../../menu-order-item/entities/menu-order-item.entity");
const restaurant_table_reservation_entity_1 = require("../../restaurant_table_reservation/entities/restaurant_table_reservation.entity");
const room_entity_1 = require("../../room/entities/room.entity");
const typeorm_1 = require("typeorm");
var BillingType;
(function (BillingType) {
    BillingType["ROOM_BOOKING"] = "room_booking";
    BillingType["MENU_ORDER"] = "menu_order";
    BillingType["TABLE_RESERVATION"] = "table_reservation";
})(BillingType || (exports.BillingType = BillingType = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["CARD"] = "card";
    PaymentMethod["ONLINE"] = "online";
    PaymentMethod["STRIPE"] = "stripe";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var BillingStatus;
(function (BillingStatus) {
    BillingStatus["PENDING"] = "pending";
    BillingStatus["PAID"] = "paid";
    BillingStatus["FAILED"] = "failed";
    BillingStatus["REFUNDED"] = "refunded";
})(BillingStatus || (exports.BillingStatus = BillingStatus = {}));
let Billing = class Billing {
    id;
    hotel_id;
    user_id;
    billing_type;
    booking_id;
    menu_order_id;
    reservation_id;
    room_id;
    amount;
    discount;
    final_amount;
    payment_method;
    status;
    transaction_id;
    paid_at;
    note;
    hotel;
    room;
    booking;
    menuOrder;
    reservation;
    created_at;
    updated_at;
};
exports.Billing = Billing;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Billing.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Billing.prototype, "hotel_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Billing.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BillingType }),
    __metadata("design:type", String)
], Billing.prototype, "billing_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Billing.prototype, "booking_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Billing.prototype, "menu_order_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Billing.prototype, "reservation_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Billing.prototype, "room_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Billing.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Billing.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Billing.prototype, "final_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentMethod }),
    __metadata("design:type", String)
], Billing.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BillingStatus,
        default: BillingStatus.PENDING,
    }),
    __metadata("design:type", String)
], Billing.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Billing.prototype, "transaction_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Billing.prototype, "paid_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Billing.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hotel_entity_1.Hotel, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'hotel_id' }),
    __metadata("design:type", hotel_entity_1.Hotel)
], Billing.prototype, "hotel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'room_id' }),
    __metadata("design:type", room_entity_1.Room)
], Billing.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'booking_id' }),
    __metadata("design:type", booking_entity_1.Booking)
], Billing.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_order_item_entity_1.MenuOrderItem, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'menu_order_id' }),
    __metadata("design:type", menu_order_item_entity_1.MenuOrderItem)
], Billing.prototype, "menuOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => restaurant_table_reservation_entity_1.Reservation, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'reservation_id' }),
    __metadata("design:type", restaurant_table_reservation_entity_1.Reservation)
], Billing.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Billing.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Billing.prototype, "updated_at", void 0);
exports.Billing = Billing = __decorate([
    (0, typeorm_1.Entity)('billing')
], Billing);
//# sourceMappingURL=billing.entity.js.map