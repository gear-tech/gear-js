import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { IRpcRequest } from 'src/json-rpc/interface';

import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly service: ApiGatewayService) {}

  @Post()
  async rpc(@Req() { body, ip }: Request) {
    if (Array.isArray(body)) {
      body.forEach(({ method, params }) => {
        if (method === 'testBalance.get') params['ip'] = ip;
      });
    } else {
      if (body.method === 'testBalance.get') body.params['ip'] = ip;
    }
    const response = await this.service.requestMessage(body);
    return response;
  }
}
