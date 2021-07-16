import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class TgExceptionFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp().getRequest();
    const status = exception.getStatus();
    if (status === 403) {
      ctx.reply(
        'User is not found. Please register on https://idea.gear-tech.io',
      );
    }
  }
}
