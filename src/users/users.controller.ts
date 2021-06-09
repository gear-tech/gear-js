import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { KeyPairDto } from './dto/keypair.dto';
import { SignMessageDto } from './dto/sign-message.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
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
  @ApiOkResponse({ type: KeyPairDto })
  createKeyPair(@Req() request) {
    return this.usersService.createKeyPair(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign')
  @ApiBody({ type: SignMessageDto })
  @ApiOkResponse({ description: 'success' })
  signMessage(@Req() request, @Body() body) {
    const message = body.message;
    const mnemonic = body.mnemonic;
    return this.usersService.signMessage(request.user.id, message, mnemonic);
  }
}
