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

    try {
      unsub = await method(cb, client.user, procedure.params);
    } catch (error) {
      this.sendResponse(client, procedure, error);
    }

    if (unsub) {
      if (unsub.unsub) {
        this.unsubs.forEach((subs) => {
          if (subs.name === unsub.name) {
            subs.complete();
            return null;
          }
        });
        this.unsubs.push(unsub);
      } else {
        const unsubIndex = this.unsubs.findIndex(
          (element) => element.name === unsub.name,
        );
        this.unsubs[unsubIndex].unsub.complete();
        this.unsubs.splice(unsubIndex, 1);
      }
    }
    return null;
  }

  unsubscribe() {
    this.unsubs.forEach((element) => {
      try {
        element.unsub.unsubscribe();
      } catch (error) {}
    });
    this.unsubs = [];
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
