import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { InternalServerError, NotFoundPath } from 'src/json-rpc/errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private statusCodes = {
    404: NotFoundPath,
    500: InternalServerError,
  };

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status;
    console.log(exception);
    if (exception.getStatus) {
      status = exception.getStatus();
    } else {
      switch (exception.message) {
        default:
          status = 500;
          break;
      }
    }

    if (status > 0) {
      exception = status in this.statusCodes ? new this.statusCodes[status]() : new this.statusCodes[500]();
    }

    if (!request.body) {
      response.json({
        jsonrpc: '2.0',
        error: exception.toJson(),
      });
    } else {
      if (Array.isArray(request.body)) {
        const result = [];
        const promises = request.body.map((procedure) => {
          result.push({
            jsonrpc: '2.0',
            id: procedure.id,
            error: exception.toJson(),
          });
        });
        await Promise.all(promises);
        response.json(result);
      } else {
        response.json({
          jsonrpc: '2.0',
          id: request.body.id,
          error: exception.toJson(),
        });
      }
    }
  }
}
