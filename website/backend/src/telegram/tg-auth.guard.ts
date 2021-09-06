import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TgAuthGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findOneTg(
      request.update.message.from.id,
    );
    if (!user) {
      return false;
    }
    context.switchToHttp().getRequest().user = user;
    return user;
  }
}
