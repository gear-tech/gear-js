import { Body, Controller, Post } from '@nestjs/common';
import { IRpcRequest } from 'src/json-rpc/interface';

import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly service: ApiGatewayService) {}

  @Post()
  async rpc(@Body() body: IRpcRequest | IRpcRequest[]) {
    console.log(body);
    return await this.service.requestMessage(body);
  }
}
