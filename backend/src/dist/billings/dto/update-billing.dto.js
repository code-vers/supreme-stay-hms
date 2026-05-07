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
exports.UpdateBillingDto = void 0;
const class_validator_1 = require("class-validator");
const billing_entity_1 = require("../entities/billing.entity");
class UpdateBillingDto {
    status;
    payment_method;
    transaction_id;
    note;
}
exports.UpdateBillingDto = UpdateBillingDto;
__decorate([
    (0, class_validator_1.IsEnum)(billing_entity_1.BillingStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBillingDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(billing_entity_1.PaymentMethod),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBillingDto.prototype, "payment_method", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBillingDto.prototype, "transaction_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBillingDto.prototype, "note", void 0);
//# sourceMappingURL=update-billing.dto.js.map