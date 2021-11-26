import { Body, Controller, Post } from '@nestjs/common';
import { HttpRpcMessageHandler } from './rpc.handler';

@Controller()
export class RpcController {
  constructor(private readonly rpcHandler: HttpRpcMessageHandler) {}

  @Post()
  async rpc(@Body() body) {
    return await this.rpcHandler.requestMessage(body);
  }
}
