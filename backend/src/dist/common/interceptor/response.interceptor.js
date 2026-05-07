"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseTransformerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let ResponseTransformerInterceptor = class ResponseTransformerInterceptor {
    logger = new common_1.Logger('HTTP');
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const startTime = Date.now();
        const method = request.method;
        const endpoint = request.originalUrl;
        return next.handle().pipe((0, operators_1.map)((data) => {
            const statusCode = response.statusCode || 200;
            const executionTime = Date.now() - startTime;
            this.logger.log(`${method} ${endpoint} ${statusCode} - ${executionTime}ms`);
            return {
                success: true,
                statusCode,
                message: data?.message || 'Request successful',
                data: data?.data ?? data,
                method,
                endpoint,
                timestamp: new Date().toISOString(),
            };
        }), (0, operators_1.catchError)((error) => {
            const statusCode = error instanceof common_1.HttpException ? error.getStatus() : 500;
            const executionTime = Date.now() - startTime;
            this.logger.error(`${method} ${endpoint} ${statusCode} - ${executionTime}ms - ${error?.message || 'Unknown error'}`);
            response.status(statusCode);
            const errors = this.extractErrors(error);
            const isValidationError = Array.isArray(errors);
            return (0, rxjs_1.of)({
                success: false,
                statusCode,
                message: isValidationError
                    ? 'Validation failed'
                    : error?.message || 'Internal server error',
                errors,
                method,
                endpoint,
                timestamp: new Date().toISOString(),
            });
        }));
    }
    extractErrors(error) {
        if (!error?.getResponse) {
            return undefined;
        }
        const errorResponse = error.getResponse();
        if (Array.isArray(errorResponse) && errorResponse.length > 0) {
            if (typeof errorResponse[0] === 'object') {
                return this.parseNestedValidationErrors(errorResponse);
            }
            return this.parseValidationMessages(errorResponse);
        }
        if (typeof errorResponse === 'object' &&
            Array.isArray(errorResponse.message) &&
            errorResponse.message.length > 0) {
            if (typeof errorResponse.message[0] === 'object') {
                return this.parseNestedValidationErrors(errorResponse.message);
            }
            return this.parseValidationMessages(errorResponse.message);
        }
        if (typeof errorResponse === 'string') {
            return { message: errorResponse };
        }
        if (typeof errorResponse === 'object' && errorResponse.message) {
            return { message: errorResponse.message };
        }
        return undefined;
    }
    parseValidationMessages(messages) {
        return messages.map((msg) => {
            const spaceIndex = msg.indexOf(' ');
            const field = spaceIndex !== -1 ? msg.substring(0, spaceIndex) : msg;
            return {
                field,
                message: msg,
            };
        });
    }
    parseNestedValidationErrors(errors) {
        const result = [];
        errors.forEach((error) => {
            if (error.children && Array.isArray(error.children)) {
                result.push(...this.parseNestedValidationErrors(error.children));
            }
            if (error.constraints) {
                Object.values(error.constraints).forEach((constraint) => {
                    result.push({
                        field: error.property ?? '',
                        message: constraint,
                    });
                });
            }
        });
        return result;
    }
};
exports.ResponseTransformerInterceptor = ResponseTransformerInterceptor;
exports.ResponseTransformerInterceptor = ResponseTransformerInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseTransformerInterceptor);
//# sourceMappingURL=response.interceptor.js.map