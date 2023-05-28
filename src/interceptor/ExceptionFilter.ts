import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    this.logger.error(`Error in request: [${request.method}]${request.url} with message: ${error.message}`);

    let message, status, code;
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error(error);
      message = error['errors']
        .map((e) => `${e.instance?.constructor?.name} id must be unique, ${e.instance?.name} already exists.`)
        .join();
      status = HttpStatus.BAD_REQUEST;
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      const field = error['index'].split(/_/g)[1];
      message = `Provided ${field} doesn't exist.`;
      status = HttpStatus.BAD_REQUEST;
    } else if (error instanceof HttpException) {
      // to capture exceptions thrown by validation pipes
      if (error['response'] && error['response']['message']) {
        message = error['response']['message'];
      } else {
        message = error?.message;
      }
      if (error['response'] && error['response']['code']) {
        code = error['response']['code'];
      }
      status = error?.getStatus() || 500;
    } else {
      this.logger.error('Unknown error happened');
      console.error(error);
      message = 'Unknown error happened';
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      code: code,
    });
  }
}
