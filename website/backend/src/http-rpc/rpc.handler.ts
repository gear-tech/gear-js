import { Injectable } from '@nestjs/common';
import { MethodNotFoundError } from 'src/json-rpc/errors';
import { RpcMessageHandler } from 'src/json-rpc/handler';
import { HttpRpcMethods } from './rpc.methods';

@Injectable()
export class HttpRpcMessageHandler extends RpcMessageHandler {
  constructor(private readonly rpcMethods: HttpRpcMethods) {
    super();
  }

  async checkProcedure(procedure, cb) {
    const method = procedure.method;
    if (!method || !this.rpcMethods.getMethod(method)) {
      cb(new MethodNotFoundError().toJson());
    } else {
      cb(null, this.rpcMethods.getMethod(method));
    }
  }
}
