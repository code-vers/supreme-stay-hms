import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ExceptionResponse = {
  message: string | string[];
  error?: string;
  statusCode?: number;
};

type FormattedError = {
  field: string;
  message: string;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let type: string = 'SYSTEM_ERROR';
    let message: string = 'Internal server error';
    let errors: FormattedError[] | null = null;

    // 1. VALIDATION ERROR
    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as ExceptionResponse;

      status = exception.getStatus();
      type = 'VALIDATION_ERROR';
      message = 'Validation failed';

      const msgs: string[] = Array.isArray(res.message)
        ? res.message
        : [res.message];

      errors = msgs.map((msg: string): FormattedError => {
        const [field] = msg.split(' ');

        return {
          field: field ?? 'unknown',
          message: msg,
        };
      });
    }

    //  2. BUSINESS ERROR
    else if (exception instanceof HttpException) {
      const res = exception.getResponse() as ExceptionResponse;

      status = exception.getStatus();
      type = 'BUSINESS_ERROR';

      message =
        typeof res.message === 'string' ? res.message : 'Business error';

      errors = null;
    }

    //  3. SYSTEM ERROR
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      type = 'SYSTEM_ERROR';
      message =
        exception instanceof Error
          ? exception.message
          : 'Something went wrong';
      errors = null;
    }

    //  FINAL RESPONSE
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
}
