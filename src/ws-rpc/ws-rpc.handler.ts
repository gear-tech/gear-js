import { Injectable } from '@nestjs/common';
import { MethodNotFoundError } from 'src/json-rpc/errors';
import { RpcMessageHandler } from 'src/json-rpc/handler';
import { WsRpcMethods } from './ws-rpc.methods';

@Injectable()
export class WsRpcMessageHandler extends RpcMessageHandler {
  private unsubs = [];

  constructor(private readonly rpcMethods: WsRpcMethods) {
    super();
  }

  async executeProcedure(client, procedure) {
    await this.checkProcedure(procedure, (err, method) => {
      if (err) {
        client.emit('message', this.getResponse(procedure, err));
      } else {
        this.executeMethod(method, client, procedure);
      }
    });
  }

  async executeMethod(method, client, procedure) {
    const cb = (error, result) => {
      this.sendResponse(client, procedure, error, result);
    };

    let unsub = null;

    if (procedure.params) {
      unsub = await method(cb, client.user, procedure.params);
    } else {
      unsub = await method(cb, client.user);
    }

    if (unsub) {
      this.unsubs.push(unsub);
    }
    return null;
  }

  unsubscribe() {
    this.unsubs.forEach((element) => {
      element();
    });
  }

  async checkProcedure(procedure, cb) {
    const method = procedure.method;
    if (!method || !this.rpcMethods.getMethod(method)) {
      cb(new MethodNotFoundError().toJson());
    } else {
      cb(null, this.rpcMethods.getMethod(method));
    }
  }

  sendResponse(client, procedure, error?, result?) {
    if (error) {
      client.emit('message', this.getResponse(procedure, error));
    } else if (result) {
      client.emit('message', this.getResponse(procedure, undefined, result));
    }
  }
}
