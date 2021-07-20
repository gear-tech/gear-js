import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { InternalServerError, UnathorizedError } from 'src/json-rpc/errors';

@Catch()
export class TgExceptionFilter implements ExceptionFilter {
  private statusCodes = {
    500: InternalServerError,
  };

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp().getRequest();
    const status = exception.getStatus();
    if (status === 403) {
      ctx.reply(
        'User is not found. Please register on https://idea.gear-tech.io',
      );
      return null;
    }

    if (status > 0) {
      exception =
        status in this.statusCodes
          ? new this.statusCodes[status]()
          : new this.statusCodes[500]();
    }
    ctx.reply(exception.message);
  }
}
