import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { InternalServerError, UnathorizedError } from 'src/json-rpc/errors';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {
  private statusCodes = {
    401: UnathorizedError,
    500: InternalServerError,
  };

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const data = ctx.getData();
    const client = ctx.getClient();
    let status;
    if (exception.getStatus) {
      status = exception.getStatus();
    } else {
      switch (exception.message) {
        case 'Forbidden resource':
          status = 401;
      }
    }

    if (status > 0) {
      exception =
        status in this.statusCodes
          ? new this.statusCodes[status]()
          : new this.statusCodes[500]();
    }

    if (Array.isArray(data)) {
      const result = [];
      const promises = data.map((procedure) => {
        client.emit('message', {
          jsonrpc: '2.0',
          id: procedure.id,
          error: exception.toJson(),
        });
      });
      await Promise.all(promises);
    } else {
      client.emit('message', {
        jsonrpc: '2.0',
        id: data.id,
        error: exception.toJson(),
      });
    }
  }
}
