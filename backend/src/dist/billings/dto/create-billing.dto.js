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
exports.CreateBillingDto = void 0;
const class_validator_1 = require("class-validator");
const billing_entity_1 = require("../entities/billing.entity");
class CreateBillingDto {
    hotel_id;
    billing_type;
    amount;
    discount;
    final_amount;
    payment_method;
    booking_id;
    room_id;
    menu_order_id;
    reservation_id;
    transaction_id;
    note;
}
exports.CreateBillingDto = CreateBillingDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBillingDto.prototype, "hotel_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(billing_entity_1.BillingType),
    __metadata("design:type", String)
], CreateBillingDto.prototype, "billing_type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateBillingDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBillingDto.prototype, "discount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateBillingDto.prototype, "final_amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(billing_entity_1.PaymentMethod),
    __metadata("design:type", String)
], CreateBillingDto.prototype, "payment_method", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.billing_type === billing_entity_1.BillingType.ROOM_BOOKING),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBillingDto.prototype, "booking_id", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.billing_type === billing_entity_1.BillingType.ROOM_BOOKING),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBillingDto.prototype, "room_id", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.billing_type === billing_entity_1.BillingType.MENU_ORDER),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBillingDto.prototype, "menu_order_id", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.billing_type === billing_entity_1.BillingType.TABLE_RESERVATION),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBillingDto.prototype, "reservation_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBillingDto.prototype, "transaction_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBillingDto.prototype, "note", void 0);
//# sourceMappingURL=create-billing.dto.js.map