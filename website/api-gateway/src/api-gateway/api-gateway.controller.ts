import { Controller, Get, Logger, Post, Req } from '@nestjs/common';
import { getResponse, verifyCaptcha } from 'src/utils';
import errors from '@gear-js/jsonrpc-errors';
import { ApiGatewayService } from './api-gateway.service';
import { IRpcRequest } from 'src/json-rpc/interface';

const logger = new Logger('ApiGatewayController');
@Controller('api')
export class ApiGatewayController {
  constructor(private readonly service: ApiGatewayService) {}

  @Post()
  async rpc(@Req() { body, ip }: { body: IRpcRequest; ip: string }) {
    if (Array.isArray(body)) {
      const testBalance = body.find((value) => value.method === 'testBalance.get');
      if (testBalance && !(await verifyCaptcha(testBalance.params.token))) {
        logger.warn(ip);
        return getResponse(body, errors.Forbidden.name);
      }
    } else {
      if (body.method === 'testBalance.get' && !(await verifyCaptcha(body.params['token']))) {
        logger.warn(ip);
        return getResponse(body, errors.Forbidden.name);
      }
    }
    const response = await this.service.requestMessage(body);
    return response;
  }
}
