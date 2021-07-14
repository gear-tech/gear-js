import { Injectable } from '@nestjs/common';
import {
  GearNodeError,
  InternalServerError,
  InvalidParamsError,
  MethodNotFoundError,
  TransactionError,
} from './errors';

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

  async requestMessage(user, message) {
    if (this.isArray(message)) {
      const results = [];
      const promises = message.map((procedure) => {
        const result = this.executeProcedure(user, procedure);
      });
      await Promise.all(promises);
      return results;
    }
    if (this.isObject(message)) {
      return this.executeProcedure(user, message);
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

  async executeProcedure(user, procedure) {
    let response = null;
    await this.checkProcedure(procedure, (err, method) => {
      if (err) {
        response = this.getResponse(procedure, err);
      } else {
        response = this.executeMethod(method, user, procedure);
      }
    });
    return response;
  }

  async executeMethod(method, user, procedure) {
    try {
      const result = await method(user, procedure.params);
      return this.getResponse(procedure, null, result);
    } catch (error) {
      if (
        error instanceof InvalidParamsError ||
        error instanceof GearNodeError ||
        error instanceof TransactionError
      ) {
        return this.getResponse(procedure, error.toJson());
      } else {
        return this.getResponse(procedure, new InternalServerError().toJson());
      }
    }
  }
}
