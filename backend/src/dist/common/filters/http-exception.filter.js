"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let type = 'SYSTEM_ERROR';
        let message = 'Internal server error';
        let errors = null;
        if (exception instanceof common_1.BadRequestException) {
            const res = exception.getResponse();
            status = exception.getStatus();
            type = 'VALIDATION_ERROR';
            message = 'Validation failed';
            const msgs = Array.isArray(res.message)
                ? res.message
                : [res.message];
            errors = msgs.map((msg) => {
                const [field] = msg.split(' ');
                return {
                    field: field ?? 'unknown',
                    message: msg,
                };
            });
        }
        else if (exception instanceof common_1.HttpException) {
            const res = exception.getResponse();
            status = exception.getStatus();
            type = 'BUSINESS_ERROR';
            message =
                typeof res.message === 'string' ? res.message : 'Business error';
            errors = null;
        }
        else {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            type = 'SYSTEM_ERROR';
            message = 'Something went wrong';
            errors = null;
        }
        response.status(status).json({
            success: false,
            type,
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
            errors,
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map