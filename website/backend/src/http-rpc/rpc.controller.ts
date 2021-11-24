import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReqUser } from './decorators';
import { HttpRpcMessageHandler } from './rpc.handler';

@Controller()
export class RpcController {
  constructor(private readonly rpcHandler: HttpRpcMessageHandler) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  async rpc(@ReqUser() user, @Body() body) {
    return await this.rpcHandler.requestMessage(user, body);
  }
}
