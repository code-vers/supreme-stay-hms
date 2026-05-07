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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantTableController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_role_enun_1 = require("../common/enum/user.role.enun");
const create_restaurant_table_dto_1 = require("./dto/create-restaurant-table.dto");
const query_restaurant_table_dto_1 = require("./dto/query-restaurant-table.dto");
const update_restaurant_table_dto_1 = require("./dto/update-restaurant-table.dto");
const restaurant_table_service_1 = require("./restaurant-table.service");
let RestaurantTableController = class RestaurantTableController {
    restaurantTableService;
    constructor(restaurantTableService) {
        this.restaurantTableService = restaurantTableService;
    }
    create(createRestaurantTableDto, userId) {
        return this.restaurantTableService.create(createRestaurantTableDto, userId);
    }
    findAll(query) {
        return this.restaurantTableService.findAll(query);
    }
    findByRestaurant(restaurantId, query) {
        return this.restaurantTableService.findByRestaurantId(restaurantId, query);
    }
    findOne(id) {
        return this.restaurantTableService.findOne(id);
    }
    update(id, updateRestaurantTableDto, userId) {
        return this.restaurantTableService.update(id, updateRestaurantTableDto, userId);
    }
    remove(id, userId) {
        return this.restaurantTableService.remove(id, userId);
    }
};
exports.RestaurantTableController = RestaurantTableController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enun_1.UserRole.PROPERTY_OWNER),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_restaurant_table_dto_1.CreateRestaurantTableDto, String]),
    __metadata("design:returntype", void 0)
], RestaurantTableController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_restaurant_table_dto_1.QueryRestaurantTableDto]),
    __metadata("design:returntype", void 0)
], RestaurantTableController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('restaurant/:restaurantId'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_restaurant_table_dto_1.QueryRestaurantTableDto]),
    __metadata("design:returntype", void 0)
], RestaurantTableController.prototype, "findByRestaurant", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RestaurantTableController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enun_1.UserRole.PROPERTY_OWNER),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_restaurant_table_dto_1.UpdateRestaurantTableDto, String]),
    __metadata("design:returntype", void 0)
], RestaurantTableController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enun_1.UserRole.PROPERTY_OWNER),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RestaurantTableController.prototype, "remove", null);
exports.RestaurantTableController = RestaurantTableController = __decorate([
    (0, common_1.Controller)('restaurant-tables'),
    __metadata("design:paramtypes", [restaurant_table_service_1.RestaurantTableService])
], RestaurantTableController);
//# sourceMappingURL=restaurant-table.controller.js.map