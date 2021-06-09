import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAll() {
    return this.usersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('keypair')
  createKeyPair(@Req() request) {
    return this.usersService.createKeyPair(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign')
  signMessage(@Req() request, @Body() body) {
    const message = body.message;
    const mnemonic = body.mnemonic;
    return this.usersService.signMessage(request.user.id, message, mnemonic);
  }
}
