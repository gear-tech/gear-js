import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/telegram')
  async loginTelegram(@Body() body) {
    return this.authService.loginTelegram(body);
  }

  @Get('login/github')
  async loginGithub(@Query() queryParams) {
    const code = queryParams.code;
    return this.authService.loginGithub(code);
  }

  // TODO! убрать! Только для теста
  @Get('login')
  login(@Query() queryParam) {
    return this.authService.getToken(queryParam.id);
  }
}
