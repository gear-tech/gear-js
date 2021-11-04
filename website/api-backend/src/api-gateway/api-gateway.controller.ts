import { Body, Controller, Post } from '@nestjs/common';
import { IRpcRequest } from 'src/json-rpc/interface';

import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly service: ApiGatewayService) {}

  @Post()
  async rpc(@Body() body: IRpcRequest | IRpcRequest[]) {
    const response = await this.service.requestMessage(body);
    console.log(response);
    return response;
  }
}
