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
exports.MenuOrderItemController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_role_enun_1 = require("../common/enum/user.role.enun");
const create_menu_order_item_dto_1 = require("./dto/create-menu-order-item.dto");
const query_menu_order_item_dto_1 = require("./dto/query-menu-order-item.dto");
const update_menu_order_item_dto_1 = require("./dto/update-menu-order-item.dto");
const menu_order_item_service_1 = require("./menu-order-item.service");
let MenuOrderItemController = class MenuOrderItemController {
    menuOrderItemService;
    constructor(menuOrderItemService) {
        this.menuOrderItemService = menuOrderItemService;
    }
    create(dto, userId) {
        return this.menuOrderItemService.create(dto, userId);
    }
    findAll(query) {
        return this.menuOrderItemService.findAll(query);
    }
    hotelReport(hotelId, userId) {
        return this.menuOrderItemService.getHotelOrderReport(hotelId, userId);
    }
    restaurantReport(restaurantId, userId) {
        return this.menuOrderItemService.getRestaurantOrderReport(restaurantId, userId);
    }
    findOne(id) {
        return this.menuOrderItemService.findOne(id);
    }
    update(id, dto, userId) {
        return this.menuOrderItemService.update(id, dto, userId);
    }
    remove(id, userId) {
        return this.menuOrderItemService.remove(id, userId);
    }
};
exports.MenuOrderItemController = MenuOrderItemController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_order_item_dto_1.CreateMenuOrderItemDto, String]),
    __metadata("design:returntype", void 0)
], MenuOrderItemController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enun_1.UserRole.PROPERTY_OWNER),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_menu_order_item_dto_1.QueryMenuOrderItemDto]),
    __metadata("design:returntype", void 0)
], MenuOrderItemController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enun_1.UserRole.PROPERTY_OWNER),
    (0, common_1.Get)('report/hotel/:hotelId'),
    __param(0, (0, common_1.Param)('hotelId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MenuOrderItemController.prototype, "hotelReport", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enun_1.UserRole.PROPERTY_OWNER),
    (0, common_1.Get)('report/restaurant/:restaurantId'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MenuOrderItemController.prototype, "restaurantReport", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuOrderItemController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enun_1.UserRole.PROPERTY_OWNER),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_menu_order_item_dto_1.UpdateMenuOrderItemDto, String]),
    __metadata("design:returntype", void 0)
], MenuOrderItemController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enun_1.UserRole.PROPERTY_OWNER),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MenuOrderItemController.prototype, "remove", null);
exports.MenuOrderItemController = MenuOrderItemController = __decorate([
    (0, common_1.Controller)('menu-orders'),
    __metadata("design:paramtypes", [menu_order_item_service_1.MenuOrderItemService])
], MenuOrderItemController);
//# sourceMappingURL=menu-order-item.controller.js.map