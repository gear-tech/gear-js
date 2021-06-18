import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GithubLoginQueryDto } from './dto/github-login-query.dto';
import { TelegramLoginDto } from './dto/telegram-login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/telegram')
  @ApiBody({ type: TelegramLoginDto })
  async loginTelegram(@Body() body: TelegramLoginDto) {
    return this.authService.loginTelegram(body);
  }

  @Get('login/github')
  @ApiQuery({ type: GithubLoginQueryDto })
  async loginGithub(@Query() queryParams) {
    const code = queryParams.code;
    return this.authService.loginGithub(code);
  }

  @Get('login/test')
  loginTest(@Query() queryParams) {
    const id = queryParams.id;
    return this.authService.testLogin(id);
  }
}
