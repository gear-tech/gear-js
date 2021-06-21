import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PublicKey } from 'src/decorators/public-key.decorator';
import { GearNodeService } from './gear-node.service';

@Controller('gear')
export class GearNodeController {
  constructor(private readonly gearService: GearNodeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('generate-keypair')
  generateKeyPair(@Req() request) {
    return this.gearService.createKeyPair(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('balance-transfer')
  async balanceTransfer(@Body() body, @PublicKey() publicKey: string) {
    await this.gearService.balanceTransfer(publicKey, body.value);
    return 'ok';
  }
}
