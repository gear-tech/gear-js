import { Router } from 'express';
import { GenesisNotFound, MethodNotFound, NetworkNotSupported, VoucherNotFound } from '../errors';
import { JsonRpcRequest, JsonRpcResponse } from '../types';

type Constructor<T = any> = new (...args: any[]) => T;
type AllowedMethods = 'get' | 'post';

const rpcMethods: Record<string, (...args: any[]) => Promise<void>> = {};
const restHandlers = new Array<{ method: AllowedMethods; path: string; handler: (...args: any[]) => Promise<any> }>();

export function JsonRpcMethod(name: string) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    rpcMethods[name] = descriptor.value;
  };
}

export function RestHandler(method: AllowedMethods, path: string) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    restHandlers.push({ method, path, handler: descriptor.value });
  };
}

export interface IJsonRpc {
  _getMethod(name: string): (...args: any[]) => Promise<void>;
  handleRequest({ method, params, id }: JsonRpcRequest): Promise<JsonRpcResponse | JsonRpcResponse[]>;
}

export interface IRestApi {
  createRestRouter(): Router;
}

export class HybridApiBase implements IJsonRpc, IRestApi {
  _getMethod(_name: string): (...args: any[]) => Promise<void> {
    throw new Error('Method not implemented.');
  }
  handleRequest(_req: JsonRpcRequest): Promise<JsonRpcResponse | JsonRpcResponse[]> {
    throw new Error('Method not implemented.');
  }
  createRestRouter(): Router {
    throw new Error('Method not implemented.');
  }
}

export function HybridApi<TBase extends Constructor<HybridApiBase>>(Base: TBase) {
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

    createRestRouter(): Router {
      const router = Router();

      for (const { method, path, handler } of restHandlers) {
        router[method](path, async (req, res) => {
          const { genesis } = req.body;
          if (!genesis) {
            res.status(400).json({ error: 'Genesis not found in the request' });
            return;
          }

          if (!this.__genesises.has(genesis)) {
            res.status(400).json({ error: 'Network is not supported' });
            return;
          }

          try {
            const result = await handler.apply(this, [{ ...req.body, ...req.params, genesis }]);
            res.json(result);
          } catch (err) {
            if (err instanceof VoucherNotFound) {
              res.json(null);
              return;
            }
            console.log(err.message);
            res.status(500).json({ error: 'Internal server error' });
          }
        });
      }

      return router;
    }
  };
}
