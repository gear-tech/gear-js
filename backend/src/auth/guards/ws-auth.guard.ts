import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants/jwt.constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const client = context.switchToWs().getClient();
    if (!client.handshake.query.Authorization) {
      return false;
    }
    const token = client.handshake.query.Authorization.split(' ')[1];
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
        ignoreExpiration: true
      });
      const user = await this.userService.findOne(decodedToken.id);
      context.switchToWs().getClient().user = user;
      return Boolean(user);
    } catch (ex) {
      return false;
    }
  }
}
