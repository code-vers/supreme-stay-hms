import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface ValidationError {
    field: string;
    message: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    statusCode: number;
    message: string;
    method: string;
    endpoint: string;
    timestamp: string;
    data?: T;
    errors?: ValidationError[] | {
        message: string;
    };
}
export declare class ResponseTransformerInterceptor implements NestInterceptor {
    private readonly logger;
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse>;
    private extractErrors;
    private parseValidationMessages;
    private parseNestedValidationErrors;
}
