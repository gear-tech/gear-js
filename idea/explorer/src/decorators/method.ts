import { GenesisNotFound, MethodNotFound, NetworkNotSupported } from '../errors';
import { JsonRpcRequest, JsonRpcResponse } from '../types';

type Constructor<T = any> = new (...args: any[]) => T;

const rpcMethods: Record<string, (...args: any[]) => Promise<void>> = {};

export function JsonRpcMethod(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    rpcMethods[name] = descriptor.value;
  };
}

export interface IJsonRpc {
  _getMethod(name: string): (...args: any[]) => Promise<void>;
  handleRequest({ method, params, id }: JsonRpcRequest): Promise<JsonRpcResponse | JsonRpcResponse[]>;
}

export class JsonRpcBase implements IJsonRpc {
  _getMethod(name: string): (...args: any[]) => Promise<void> {
    throw new Error('Method not implemented.');
  }
  handleRequest({ method, params, id }: JsonRpcRequest): Promise<JsonRpcResponse | JsonRpcResponse[]> {
    throw new Error('Method not implemented.');
  }
}

export function JsonRpc<TBase extends Constructor<JsonRpcBase>>(Base: TBase) {
  return class Jsonrpc extends Base {
    private __methods = new Set(Object.keys(rpcMethods));
    private __genesises: Set<string>;

    setGenesises(genesises: string[]) {
      this.__genesises = new Set(genesises);
    }

    _getMethod(name: string) {
      if (!this.__methods.has(name)) {
        throw new MethodNotFound();
      }
      return rpcMethods[name];
    }

    async handleRequest(req: JsonRpcRequest | JsonRpcRequest[]): Promise<JsonRpcResponse | JsonRpcResponse[]> {
      if (Array.isArray(req)) {
        return Promise.all(req.map((r) => this.executeMethod(r)));
      } else {
        return this.executeMethod(req);
      }
    }

    async executeMethod({ method, params, id }: JsonRpcRequest): Promise<JsonRpcResponse> {
      try {
        if (!params.genesis) {
          throw new GenesisNotFound();
        }
        if (!this.__genesises.has(params.genesis)) {
          throw new NetworkNotSupported(params.genesis);
        }

        const result = await this._getMethod(method).apply(this, [params]);
        return {
          jsonrpc: '2.0',
          id,
          result,
        };
      } catch (err) {
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: err.code || -32603,
            message: err.message,
            data: err.data || undefined,
          },
        };
      }
    }
  };
}
