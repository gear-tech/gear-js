import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MethodNotFoundError } from './errors';
import { IRpcRequest, IRpcResponse } from './interface';
import errors from '@gear-js/jsonrpc-errors';

@Injectable()
export class RpcMessageHandler {
  isArray = (message: any) => Array.isArray(message);
  isObject = (message: any) => {
    return typeof message === 'object' && message != null;
  };

  methods: {};

  checkMethod(procedure: IRpcRequest): (params: any) => Observable<any> {
    const method = procedure.method;
    if (!method) {
      throw new MethodNotFoundError();
    } else {
      return this.getMethod(method);
    }
  }

  getResponse(procedure: IRpcRequest, error?: any, result?: any): IRpcResponse {
    const response: IRpcResponse = {
      jsonrpc: '2.0',
      id: procedure.id,
    };
    if (error) {
      response['error'] = { message: errors[error].message, code: errors[error].code };
    } else if (result) {
      response['result'] = result;
    }
    return response;
  }

  getMethod(methodName: string): (params: any) => Observable<any> {
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

  async requestMessage(message: IRpcRequest | IRpcRequest[]): Promise<IRpcResponse | IRpcResponse[]> {
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

  async executeProcedure(procedure: IRpcRequest): Promise<IRpcResponse> {
    let response = null;
    try {
      const method = this.checkMethod(procedure);
      if (!method) {
        throw new MethodNotFoundError();
      }
      response = this.executeMethod(method, procedure);
    } catch (error) {
      response = this.getResponse(procedure, error.toJson());
    }
    return response;
  }

  executeMethod(method: (params: any) => Observable<any>, procedure: IRpcRequest): Promise<IRpcResponse> {
    const result = method(procedure.params);

    if (!result) {
      return;
    }
    return new Promise((resolve) => {
      result.forEach((value) => {
        if (!value) {
          resolve(this.getResponse(procedure, errors.ServiceIsNotAvaiable.name));
        } else if ('error' in value) {
          resolve(this.getResponse(procedure, value.error));
        } else if ('result' in value) {
          resolve(this.getResponse(procedure, null, value.result));
        } else {
          resolve(this.getResponse(procedure, errors.UnableToGetData.name));
        }
      });
    });
  }
}
