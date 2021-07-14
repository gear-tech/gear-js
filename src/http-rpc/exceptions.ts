import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  InternalServerError,
  NotFoundPath,
  UnathorizedError,
} from 'src/json-rpc/errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private statusCodes = {
    401: UnathorizedError,
    404: NotFoundPath,
    500: InternalServerError,
  };

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!(status in this.statusCodes)) {
      status = 500;
    }
    if (Array.isArray(request.body)) {
      const result = [];
      const promises = request.body.map((procedure) => {
        result.push({
          jsonrpc: '2.0',
          id: procedure.id,
          error: new this.statusCodes[status]().toJson(),
        });
      });
      await Promise.all(promises);
      response.json(result);
    } else {
      response.json({
        jsonrpc: '2.0',
        id: request.body.id,
        error: new this.statusCodes[status]().toJson(),
      });
    }
  }
}
