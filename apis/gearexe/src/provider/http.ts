import { IGearExeProvider, IJsonRpcResponse } from '../types/index.js';
import { snakeToCamel } from '../util/index.js';
import { encodeJsonRpc, getErrorMessage, isErrorResponse } from './jsonrpc.js';

type HttpUrl = `http://${string}` | `https://${string}`;

export class HttpGearexeProvider implements IGearExeProvider {
  constructor(private _url: HttpUrl = 'http://127.0.0.1:9944') {}

  connect(): Promise<void> {
    return Promise.resolve();
  }

  disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async send<Result = unknown>(method: string, parameters: unknown[]): Promise<Result> {
    const body = encodeJsonRpc(method, parameters);

    const response = await fetch(this._url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Request failed. ' + response.statusText);
    }

    const json: IJsonRpcResponse<Result> = await response.json();

    if (isErrorResponse(json)) {
      throw new Error(getErrorMessage(json));
    }

    return snakeToCamel(json.result);
  }

  subscribe(): number {
    throw new Error('Subscribe method not supported for HTTP provider');
  }

  unsubscribe() {
    throw new Error('Unsubscribe method not supported for HTTP provider');
  }
}
