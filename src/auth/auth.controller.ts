import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/telegram')
  async loginTelegram(@Body() body) {
    return this.authService.loginTelegram(body);
  }
}
