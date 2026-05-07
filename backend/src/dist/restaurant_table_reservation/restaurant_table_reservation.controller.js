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
exports.ReservationController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_role_enun_1 = require("../common/enum/user.role.enun");
const create_restaurant_table_reservation_dto_1 = require("./dto/create-restaurant_table_reservation.dto");
const query_reservation_dto_1 = require("./dto/query-reservation.dto");
const update_restaurant_table_reservation_dto_1 = require("./dto/update-restaurant_table_reservation.dto");
const restaurant_table_reservation_service_1 = require("./restaurant_table_reservation.service");
let ReservationController = class ReservationController {
    reservationService;
    constructor(reservationService) {
        this.reservationService = reservationService;
    }
    create(dto, userId) {
        return this.reservationService.create(dto, userId);
    }
    findAll(query) {
        return this.reservationService.findAll(query);
    }
    findMyReservations(userId, query) {
        return this.reservationService.findMyReservations(userId, query);
    }
    checkAvailability(tableId, date, durationMinutes) {
        return this.reservationService.getTableAvailability(tableId, date, durationMinutes ? Number(durationMinutes) : 120);
    }
    getReport(restaurantId, userId) {
        return this.reservationService.getRestaurantReport(restaurantId, userId);
    }
    findOne(id) {
        return this.reservationService.findOne(id);
    }
    updateStatus(id, dto, userId) {
        return this.reservationService.updateStatus(id, dto, userId);
    }
    cancel(id, userId) {
        return this.reservationService.cancelReservation(id, userId);
    }
};
exports.ReservationController = ReservationController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_restaurant_table_reservation_dto_1.CreateReservationDto, String]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enun_1.UserRole.PROPERTY_OWNER),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_reservation_dto_1.QueryReservationDto]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-reservations'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_reservation_dto_1.QueryReservationDto]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "findMyReservations", null);
__decorate([
    (0, common_1.Get)('availability/:tableId'),
    __param(0, (0, common_1.Param)('tableId')),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Query)('duration_minutes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enun_1.UserRole.PROPERTY_OWNER),
    (0, common_1.Get)('report/:restaurantId'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "getReport", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enun_1.UserRole.PROPERTY_OWNER),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_restaurant_table_reservation_dto_1.UpdateReservationDto, String]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "cancel", null);
exports.ReservationController = ReservationController = __decorate([
    (0, common_1.Controller)('table/reservations'),
    __metadata("design:paramtypes", [restaurant_table_reservation_service_1.ReservationService])
], ReservationController);
//# sourceMappingURL=restaurant_table_reservation.controller.js.map