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
exports.CreateRestaurantTableDto = void 0;
const class_validator_1 = require("class-validator");
const restaurant_table_entity_1 = require("../entities/restaurant-table.entity");
class CreateRestaurantTableDto {
    restaurant_id;
    table_number;
    capacity;
    status;
}
exports.CreateRestaurantTableDto = CreateRestaurantTableDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRestaurantTableDto.prototype, "restaurant_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateRestaurantTableDto.prototype, "table_number", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateRestaurantTableDto.prototype, "capacity", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(restaurant_table_entity_1.RestaurantTableStatus),
    __metadata("design:type", String)
], CreateRestaurantTableDto.prototype, "status", void 0);
//# sourceMappingURL=create-restaurant-table.dto.js.map