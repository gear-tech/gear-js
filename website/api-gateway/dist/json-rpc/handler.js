'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.RpcMessageHandler = void 0;
const common_1 = require('@nestjs/common');
const errors_1 = require('./errors');
let RpcMessageHandler = class RpcMessageHandler {
  constructor() {
    this.isArray = (message) => Array.isArray(message);
    this.isObject = (message) => {
      return typeof message === 'object' && message != null;
    };
  }
  checkMethod(procedure) {
    const method = procedure.method;
    if (!method) {
      throw new errors_1.MethodNotFoundError();
    } else {
      return this.getMethod(method);
    }
  }
  getResponse(procedure, error, result) {
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
  getMethod(methodName) {
    const method = methodName.split('.');
    let result = Object.getOwnPropertyDescriptor(this.methods, method[0]);
    if (result && method.length > 1) {
      method.slice(1).forEach((element) => {
        result = Object.getOwnPropertyDescriptor(result.value, element);
        if (!result) {
          return undefined;
        }
      });
    }
    return result ? result.value : result;
  }
  async requestMessage(message) {
    if (message instanceof Array) {
      const results = [];
      const promises = message.map(async (procedure) => {
        const result = await this.executeProcedure(procedure);
        results.push(result);
      });
      await Promise.all(promises);
      return results;
    } else {
      return this.executeProcedure(message);
    }
  }
  async executeProcedure(procedure) {
    let response = null;
    try {
      const method = this.checkMethod(procedure);
      if (!method) {
        throw new errors_1.MethodNotFoundError();
      }
      response = this.executeMethod(method, procedure);
    } catch (error) {
      response = this.getResponse(procedure, error.toJson());
    }
    return response;
  }
  executeMethod(method, procedure) {
    const result = method(procedure.params);
    if (result) {
      return new Promise((resolve, reject) => {
        result
          .forEach((value) => {
            if (!value) {
              resolve(this.getResponse(procedure, { error: 'Service is not available' }));
            } else if (value.error) {
              resolve(this.getResponse(procedure, value));
            } else {
              resolve(this.getResponse(procedure, null, value));
            }
          })
          .finally(() => console.log('end'));
      });
    }
  }
};
RpcMessageHandler = __decorate([(0, common_1.Injectable)()], RpcMessageHandler);
exports.RpcMessageHandler = RpcMessageHandler;
//# sourceMappingURL=handler.js.map
