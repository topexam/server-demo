import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { ErrorStatusMapper } from '@/constant';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(
    exception: Record<string, any> | HttpException,
    host: ArgumentsHost,
  ): void {
    Logger.error(exception, 'AllExceptionsFilter');
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Server internal error';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      if (exception.getStatus() === 400) {
        const resData = exception.getResponse() as Record<string, any>;
        if (typeof resData === 'object') {
          message = resData.message;
        }
      } else {
        message = exception.message;
      }
    } else {
      const rpcError = exception as {
        code: number;
        details: string;
      };

      httpStatus =
        ErrorStatusMapper[rpcError.code] || HttpStatus.INTERNAL_SERVER_ERROR;
      message = rpcError.details;
    }

    httpAdapter.reply(
      ctx.getResponse(),
      { statusCode: httpStatus, message },
      httpStatus,
    );
  }
}
