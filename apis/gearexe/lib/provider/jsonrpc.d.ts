import { IJsonRpcRequest, IJsonRpcResponse, IJsonRpcResponseError } from '../types/index.js';
export declare function encodeJsonRpc(method: string, parameters: unknown[]): IJsonRpcRequest;
export declare function isErrorResponse(response: IJsonRpcResponse): response is IJsonRpcResponseError;
export declare function getErrorMessage(response: IJsonRpcResponseError): string;
