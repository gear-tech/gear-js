import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { UnathorizedError } from 'src/json-rpc/errors';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const data = ctx.getData();
    const client = ctx.getClient();

    if (Array.isArray(data)) {
      const result = [];
      const promises = data.map((procedure) => {
        client.emit('message', {
          jsonrpc: '2.0',
          id: procedure.id,
          error: new UnathorizedError().toJson(),
        });
      });
      await Promise.all(promises);
    } else {
      client.emit('message', {
        jsonrpc: '2.0',
        id: data.id,
        error: new UnathorizedError().toJson(),
      });
    }
  }
}
