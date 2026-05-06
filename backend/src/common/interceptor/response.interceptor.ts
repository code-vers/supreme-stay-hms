import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  errors?: ValidationError[] | { message: string };
}

interface ErrorDetail {
  property?: string;
  constraints?: Record<string, string>;
  children?: ErrorDetail[];
}

@Injectable()
export class ResponseTransformerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const startTime = Date.now();
    const method = request.method;
    const endpoint = request.originalUrl;

    return next.handle().pipe(
      map((data: any) => {
        const statusCode = response.statusCode || 200;
        const executionTime = Date.now() - startTime;

        this.logger.log(
          `${method} ${endpoint} ${statusCode} - ${executionTime}ms`,
        );

        return {
          success: true,
          statusCode,
          message: (data?.message as string) || 'Request successful',
          data: data?.data ?? data,
          method,
          endpoint,
          timestamp: new Date().toISOString(),
        };
      }),

      catchError((error: any) => {
        const statusCode =
          error instanceof HttpException ? error.getStatus() : 500;

        const executionTime = Date.now() - startTime;

        this.logger.error(
          `${method} ${endpoint} ${statusCode} - ${executionTime}ms - ${error?.message || 'Unknown error'}`,
        );

        response.status(statusCode);

        const errors = this.extractErrors(error);
        const isValidationError = Array.isArray(errors);

        return of({
          success: false,
          statusCode,
          message: isValidationError
            ? 'Validation failed'
            : (error?.message as string) || 'Internal server error',
          errors,
          method,
          endpoint,
          timestamp: new Date().toISOString(),
        });
      }),
    );
  }

  private extractErrors(
    error: any,
  ): ValidationError[] | { message: string } | undefined {
    if (!error?.getResponse) {
      return undefined;
    }

    const errorResponse: any = error.getResponse();

    if (Array.isArray(errorResponse) && errorResponse.length > 0) {
      if (typeof errorResponse[0] === 'object') {
        return this.parseNestedValidationErrors(errorResponse as ErrorDetail[]);
      }
      return this.parseValidationMessages(errorResponse as string[]);
    }

    // Handle nested validation error objects from class-validator
    if (
      typeof errorResponse === 'object' &&
      Array.isArray(errorResponse.message) &&
      errorResponse.message.length > 0
    ) {
      // Check if messages are objects (nested validation) or strings
      if (typeof errorResponse.message[0] === 'object') {
        return this.parseNestedValidationErrors(
          errorResponse.message as ErrorDetail[],
        );
      }
      return this.parseValidationMessages(errorResponse.message as string[]);
    }

    // Single string message
    if (typeof errorResponse === 'string') {
      return { message: errorResponse };
    }

    if (typeof errorResponse === 'object' && errorResponse.message) {
      return { message: errorResponse.message as string };
    }

    return undefined;
  }

  private parseValidationMessages(messages: string[]): ValidationError[] {
    return messages.map((msg) => {
      // "firstName must be a string" -> field: "firstName"
      const spaceIndex = msg.indexOf(' ');
      const field = spaceIndex !== -1 ? msg.substring(0, spaceIndex) : msg;

      return {
        field,
        message: msg,
      };
    });
  }

  private parseNestedValidationErrors(
    errors: ErrorDetail[],
  ): ValidationError[] {
    const result: ValidationError[] = [];

    errors.forEach((error) => {
      // If error has children (nested validation), recurse
      if (error.children && Array.isArray(error.children)) {
        result.push(...this.parseNestedValidationErrors(error.children));
      }

      // If error has constraints, add them as separate errors
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
}
