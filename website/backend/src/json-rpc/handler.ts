import { Injectable } from '@nestjs/common';
import { MethodNotFoundError } from './errors';

@Injectable()
export class RpcMessageHandler {
  isArray = (message) => Array.isArray(message);
  isObject = (message) => {
    return typeof message === 'object' && message != null;
  };

  async checkProcedure(procedure, cb) {
    const method = procedure.method;
    if (!method) {
      cb(new MethodNotFoundError().toJson());
    } else {
      cb(null, () => {});
    }
  }

  async requestMessage(message) {
    if (this.isArray(message)) {
      const results = [];
      const promises = message.map((procedure) => {
        return this.executeProcedure(procedure);
      });
      await Promise.all(promises);
      return results;
    }
    if (this.isObject(message)) {
      return this.executeProcedure(message);
    }
  }

  getResponse(procedure, error?, result?) {
    const response = {
      jsonrpc: '2.0',
      id: procedure.id,
    };
    if (error) {
      response['error'] = error;
    } else if (result) {
      response['result'] = result;
    }
    return response;
  }

  async executeProcedure(procedure) {
    let response = null;
    await this.checkProcedure(procedure, (err, method) => {
      if (err) {
        response = this.getResponse(procedure, err);
      } else {
        response = this.executeMethod(method, procedure);
      }
    });
    return response;
  }

  async executeMethod(method, procedure) {
    const result = await method(procedure.params);
    return this.getResponse(procedure, null, result);
  }
}
