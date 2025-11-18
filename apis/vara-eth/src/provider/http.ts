import { IVaraEthProvider, IJsonRpcResponse } from '../types/index.js';
import { snakeToCamel } from '../util/index.js';
import { createJsonRpcRequest, getErrorMessage, isErrorResponse } from './jsonrpc.js';

type HttpUrl = `http://${string}` | `https://${string}`;

interface HttpOptions {
  requestTimeout?: number;
}

export class HttpVaraEthProvider implements IVaraEthProvider {
  private _options: Required<HttpOptions>;

  constructor(
    private _url: HttpUrl = 'http://127.0.0.1:9944',
    options: HttpOptions = {},
  ) {
    this._options = {
      requestTimeout: 30_000,
      ...options,
    };
  }

  public connect(): Promise<void> {
    return Promise.resolve();
  }

  public disconnect(): Promise<void> {
    return Promise.resolve();
  }

  public async send<Result = unknown>(
    method: string,
    parameters: unknown[],
    options?: { timeout?: number },
  ): Promise<Result> {
    const body = createJsonRpcRequest(method, parameters);

    const abortController = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const timeout = options?.timeout ?? this._options.requestTimeout;
    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        abortController.abort();
      }, timeout);
    }

    try {
      const response = await fetch(this._url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: abortController.signal,
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        throw new Error('Request failed. ' + response.statusText);
      }

      const json: IJsonRpcResponse<Result> = await response.json();

      if (isErrorResponse(json)) {
        throw new Error(getErrorMessage(json));
      }

      return snakeToCamel(json.result);
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }

      throw error;
    }
  }

  public subscribe(): Promise<() => void> {
    return Promise.reject(new Error('Subscribe method not supported for HTTP provider'));
  }
}
