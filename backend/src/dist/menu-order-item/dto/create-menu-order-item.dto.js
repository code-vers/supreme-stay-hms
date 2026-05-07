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
exports.CreateMenuOrderItemDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const menu_order_item_entity_1 = require("../entities/menu-order-item.entity");
class CreateMenuOrderItemDto {
    hotel_id;
    restaurant_id;
    menu_item_id;
    category;
    table_id;
    room_id;
    quantity;
    price;
    subtotal;
    note;
    delivery_time;
}
exports.CreateMenuOrderItemDto = CreateMenuOrderItemDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMenuOrderItemDto.prototype, "hotel_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMenuOrderItemDto.prototype, "restaurant_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMenuOrderItemDto.prototype, "menu_item_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(menu_order_item_entity_1.OrderCategory),
    __metadata("design:type", String)
], CreateMenuOrderItemDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.room_id),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMenuOrderItemDto.prototype, "table_id", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.table_id),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMenuOrderItemDto.prototype, "room_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateMenuOrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateMenuOrderItemDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateMenuOrderItemDto.prototype, "subtotal", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMenuOrderItemDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateMenuOrderItemDto.prototype, "delivery_time", void 0);
//# sourceMappingURL=create-menu-order-item.dto.js.map