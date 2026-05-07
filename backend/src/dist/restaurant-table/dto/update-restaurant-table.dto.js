"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRestaurantTableDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_restaurant_table_dto_1 = require("./create-restaurant-table.dto");
class UpdateRestaurantTableDto extends (0, mapped_types_1.PartialType)(create_restaurant_table_dto_1.CreateRestaurantTableDto) {
}
exports.UpdateRestaurantTableDto = UpdateRestaurantTableDto;
//# sourceMappingURL=update-restaurant-table.dto.js.map