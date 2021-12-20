import { Observable } from 'rxjs';
import { IRpcRequest, IRpcResponse } from './interface';
export declare class RpcMessageHandler {
  isArray: (message: any) => boolean;
  isObject: (message: any) => boolean;
  methods: {};
  checkMethod(procedure: IRpcRequest): (params: any) => Observable<any>;
  getResponse(procedure: IRpcRequest, error?: any, result?: any): IRpcResponse;
  getMethod(methodName: string): (params: any) => Observable<any>;
  requestMessage(message: IRpcRequest | IRpcRequest[]): Promise<IRpcResponse | IRpcResponse[]>;
  executeProcedure(procedure: IRpcRequest): Promise<IRpcResponse>;
  executeMethod(method: (params: any) => Observable<any>, procedure: IRpcRequest): Promise<unknown>;
}
