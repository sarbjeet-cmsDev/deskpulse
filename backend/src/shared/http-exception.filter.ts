import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';
    let error: string | null = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const responseMessage =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : (exceptionResponse as any);

      const exceptionStatus = exception.getStatus();

      const isValidationError =
        (exceptionStatus === HttpStatus.BAD_REQUEST || exceptionStatus === HttpStatus.UNPROCESSABLE_ENTITY) &&
        responseMessage.message &&
        Array.isArray(responseMessage.message);

      if (isValidationError) {
        status = exceptionStatus; // either 400 or 422
        message = responseMessage.message;
        error = responseMessage.error || 'Validation Error';
      } else {
        status = exceptionStatus;
        message = responseMessage.message || exception.message;
        error = responseMessage.error || null;
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error,
    });
  }
}
