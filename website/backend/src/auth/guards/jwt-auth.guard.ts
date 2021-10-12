import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (
      request.body.method === 'login.telegram' ||
      request.body.method === 'login.github' ||
      (+process.env.DEBUG && request.body.method === 'login.dev')
    ) {
      return true;
    }
    return super.canActivate(context);
  }
}
