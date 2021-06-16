import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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

  // @UseGuards(JwtAuthGuard)
  // @Get('keypair')
  // @ApiOkResponse({ type: KeyPairDto })
  // createKeyPair(@Req() request) {
  //   return this.gearNodeService.createKeyPair(request.user);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post('sign')
  // @ApiBody({ type: SignMessageDto })
  // @ApiOkResponse({ description: 'success' })
  // signMessage(@Req() request, @Body() body) {
  //   const message = body.message;
  //   const mnemonic = body.mnemonic;
  //   const keyPair = this.gearNodeService.getKeyringByMnemonic(
  //     request.user,
  //     mnemonic,
  //   );
  //   return this.gearNodeService.checkSign(keyPair, message);
  // }
}
