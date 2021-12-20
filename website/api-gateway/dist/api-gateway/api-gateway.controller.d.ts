import { IRpcRequest } from 'src/json-rpc/interface';
import { ApiGatewayService } from './api-gateway.service';
export declare class ApiGatewayController {
  private readonly service;
  constructor(service: ApiGatewayService);
  rpc(
    body: IRpcRequest | IRpcRequest[],
  ): Promise<import('src/json-rpc/interface').IRpcResponse | import('src/json-rpc/interface').IRpcResponse[]>;
}
