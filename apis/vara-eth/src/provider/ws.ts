import type {
  IJsonRpcMessage,
  IJsonRpcRequest,
  ISubscriptionCallback,
  IVaraEthProvider,
  WsUrl,
} from '../types/index.js';
import { snakeToCamel } from '../util/index.js';
import { createJsonRpcRequest, getErrorMessage, isErrorMessage, isSubscriptionMessage } from './jsonrpc.js';
import { isWsUrl } from './util.js';

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'failed';

export type ConnectionEventType = 'connecting' | 'connected' | 'disconnected' | 'error' | 'retry';
export type ConnectionEventListener = (event: {
  type: ConnectionEventType;
  error?: Error;
  attempt?: number;
  state?: ConnectionState;
  details?: Record<string, unknown>;
}) => void;

const ERRORS = {
  INVALID_URL: (url: string) => `Invalid URL: ${url}`,
  DISCONNECTED_SEND: 'Cannot send request: WebSocket is disconnected. Call connect() first.',
  DISCONNECTED_SUBSCRIBE: 'Cannot subscribe: WebSocket is disconnected. Call connect() first.',
  FAILED_SEND: 'Cannot send request: WebSocket connection failed. Call connect() to retry.',
  FAILED_SUBSCRIBE: 'Cannot subscribe: WebSocket connection failed. Call connect() to retry.',
  CONNECTION_CLOSED: 'WebSocket connection closed unexpectedly. Call connect() to reconnect.',
  CONNECTION_ERROR: 'Failed to connect to WebSocket. Check your network connection and server availability.',
  MANUALLY_CLOSED: 'Connection was manually closed',
  REQUEST_TIMEOUT: (timeoutMs: number) =>
    `Request timed out after ${timeoutMs}ms. Try increasing the timeout or check your network connection.`,
  CONNECTION_EXHAUSTED: (attempts: number) =>
    `Failed to connect after ${attempts} attempts. Check your network connection and server availability.`,
} as const;

interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  request: () => void;
}

export interface ConnectionOptions {
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  requestTimeout?: number;
}

interface ISubscriptionParameters<Error = unknown, Result = unknown> {
  isInitialized: boolean;
  callback: ISubscriptionCallback<Error, Result>;
}

export class WsVaraEthProvider implements IVaraEthProvider {
  private _conn?: WebSocket;
  private _state: ConnectionState = 'disconnected';
  private _nextId: number = 1;
  private _pendingRequests: Map<
    number,
    {
      resolve: (value: any) => void;
      reject: (error: Error) => void;
      timeoutId?: ReturnType<typeof setTimeout>;
    }
  > = new Map();
  private _subscriptions: Map<number, ISubscriptionParameters<any, any>> = new Map();
  private _subscriptionIds: Map<number, number> = new Map();
  private _requestQueue: QueuedRequest[] = [];
  private _connectionPromise?: Promise<void>;
  private _options: Required<ConnectionOptions>;
  private _onOpen?: () => void;
  private _onError?: (event: Event) => void;
  private _eventListeners: Map<ConnectionEventType, ConnectionEventListener[]> = new Map();
  private _connectionStartTime?: number;
  private _url: WsUrl;

  constructor(url: string = 'ws://127.0.0.1:9944', options: ConnectionOptions = {}) {
    if (!isWsUrl(url)) {
      throw new Error(ERRORS.INVALID_URL(url));
    }

    this._url = url;

    this._options = {
      autoConnect: true,
      reconnectAttempts: 3,
      reconnectDelay: 1000,
      requestTimeout: 30_000,
      ...options,
    };

    if (this._options.autoConnect) {
      this.connect();
    }
  }

  private _createRequest(method: string, parameters: unknown[]): IJsonRpcRequest {
    return createJsonRpcRequest(method, parameters, this._nextId++);
  }

  private _setRequestTimeout(requestId: number, timeoutMs: number): ReturnType<typeof setTimeout> | undefined {
    if (timeoutMs <= 0) return undefined;

    return setTimeout(() => {
      const pending = this._pendingRequests.get(requestId);
      if (pending) {
        this._pendingRequests.delete(requestId);
        pending.reject(new Error(ERRORS.REQUEST_TIMEOUT(timeoutMs)));
      }
    }, timeoutMs);
  }

  private _emitEvent(
    type: ConnectionEventType,
    data?: { error?: Error; attempt?: number; state?: ConnectionState; details?: Record<string, unknown> },
  ): void {
    const listeners = this._eventListeners.get(type) || [];
    const event = { type, ...data };

    for (const listener of listeners) {
      try {
        listener(event);
      } catch (error) {
        console.error(`Error in connection event listener for ${type}:`, error);
      }
    }
  }

  private _cleanupConnectionListeners(): void {
    if (this._onOpen) {
      this._conn?.removeEventListener('open', this._onOpen);
      this._onOpen = undefined;
    }
    if (this._onError) {
      this._conn?.removeEventListener('error', this._onError);
      this._onError = undefined;
    }
  }

  private _removeAllListeners(): void {
    this._cleanupConnectionListeners();

    if (this._conn) {
      this._conn.removeEventListener('close', this._onClose);
      this._conn.removeEventListener('message', this._onMessage);
    }
  }

  private _processQueue(): void {
    while (this._requestQueue.length > 0 && this._state === 'connected') {
      const queuedRequest = this._requestQueue.shift();
      if (!queuedRequest) continue;
      queuedRequest.request();
    }
  }

  private _rejectPendingRequests(error: Error): void {
    for (const pending of this._pendingRequests.values()) {
      if (pending.timeoutId) {
        clearTimeout(pending.timeoutId);
      }
      pending.reject(error);
    }
    this._pendingRequests.clear();

    for (const queuedRequest of this._requestQueue) {
      queuedRequest.reject(error);
    }
    this._requestQueue.length = 0;

    for (const subscription of this._subscriptions.values()) {
      subscription.callback(error, null);
    }
  }

  private _onClose = (event: CloseEvent) => {
    this._state = 'disconnected';

    const error = new Error(event.wasClean ? 'WebSocket connection closed cleanly' : ERRORS.CONNECTION_CLOSED);

    // Emit disconnected event
    this._emitEvent('disconnected', {
      error,
      state: this._state,
      details: {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      },
    });

    this._rejectPendingRequests(error);
  };

  private _onMessage = (event: MessageEvent) => {
    try {
      const msg: IJsonRpcMessage = JSON.parse(event.data);

      if (isErrorMessage(msg)) {
        const errorMessage = getErrorMessage(msg);
        const error = new Error(errorMessage);

        const pending = this._pendingRequests.get(msg.id);
        if (pending) {
          if (pending.timeoutId) {
            clearTimeout(pending.timeoutId);
          }
          this._pendingRequests.delete(msg.id);
          pending.reject(error);
        }

        const subscription = this._subscriptions.get(msg.id);
        if (subscription) {
          subscription.callback(error, null);
        }
      } else if (isSubscriptionMessage(msg)) {
        const id = msg.params.subscription;
        const subscription = this._subscriptions.get(id);

        if (subscription) {
          if (!subscription.isInitialized) {
            // TODO: figure out if this possible
            console.error('Got subscription message before initialization');
          } else {
            subscription.callback(null, snakeToCamel(msg.params.result));
          }
        }
      } else {
        const pending = this._pendingRequests.get(msg.id);
        if (pending) {
          if (pending.timeoutId) {
            clearTimeout(pending.timeoutId);
          }
          this._pendingRequests.delete(msg.id);
          pending.resolve(snakeToCamel(msg.result));
        }

        const subscription = this._subscriptions.get(msg.id);
        if (subscription) {
          const id = msg.result as number;
          const callback = subscription.callback;

          this._subscriptions.set(id, {
            isInitialized: true,
            callback,
          });
          this._subscriptionIds.set(msg.id, id);
          this._subscriptions.delete(msg.id);
        }
      }
    } catch (error) {
      console.error('Failed to parse JsonRPC response:', error);
    }
  };

  get isConnected(): boolean {
    return this._state === 'connected';
  }

  get connectionState(): ConnectionState {
    return this._state;
  }

  get url(): WsUrl {
    return this._url;
  }

  public async connect(): Promise<void> {
    if (this._state === 'connected' || this._state === 'connecting') {
      return this._connectionPromise || Promise.resolve();
    }

    this._connectionPromise = this._attemptConnection();
    return this._connectionPromise;
  }

  public on(event: ConnectionEventType, listener: ConnectionEventListener): void {
    if (!this._eventListeners.has(event)) {
      this._eventListeners.set(event, []);
    }
    const listeners = this._eventListeners.get(event);
    if (!listeners) {
      console.error('Event listeners not found for event:', event);
      return;
    }
    listeners.push(listener);
  }

  public off(event: ConnectionEventType, listener?: ConnectionEventListener): void {
    if (!listener) {
      this._eventListeners.delete(event);
      return;
    }

    const listeners = this._eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      if (listeners.length === 0) {
        this._eventListeners.delete(event);
      }
    }
  }

  private async _attemptConnection(attempt: number = 1): Promise<void> {
    return new Promise((resolve, reject) => {
      this._state = 'connecting';
      this._connectionStartTime = Date.now();

      this._emitEvent('connecting', { attempt, state: this._state });

      this._removeAllListeners();

      try {
        this._conn = new WebSocket(this._url);

        this._onOpen = () => {
          this._cleanupConnectionListeners();
          this._state = 'connected';

          const connectionDuration = this._connectionStartTime ? Date.now() - this._connectionStartTime : 0;
          this._emitEvent('connected', {
            state: this._state,
            attempt,
            details: { connectionDuration },
          });

          this._processQueue();
          resolve();
        };

        this._onError = () => {
          this._cleanupConnectionListeners();
          this._state = 'failed';

          const error = new Error(ERRORS.CONNECTION_ERROR);

          this._emitEvent('error', { error, attempt, state: this._state });

          if (attempt < this._options.reconnectAttempts) {
            this._emitEvent('retry', {
              attempt: attempt + 1,
              state: this._state,
              details: { delay: this._options.reconnectDelay },
            });

            setTimeout(() => {
              this._attemptConnection(attempt + 1)
                .then(resolve)
                .catch(reject);
            }, this._options.reconnectDelay);
          } else {
            this._rejectPendingRequests(error);
            const connectionError = new Error(ERRORS.CONNECTION_EXHAUSTED(attempt));
            reject(connectionError);
          }
        };

        this._conn.addEventListener('open', this._onOpen);
        this._conn.addEventListener('error', this._onError);
        this._conn.addEventListener('close', this._onClose);
        this._conn.addEventListener('message', this._onMessage);
      } catch (error) {
        this._state = 'failed';
        reject(error);
      }
    });
  }

  public async disconnect(): Promise<void> {
    this._state = 'disconnected';
    this._connectionPromise = undefined;

    this._removeAllListeners();

    if (this._conn) {
      this._conn.close();
      this._conn = undefined;
    }

    const error = new Error(ERRORS.MANUALLY_CLOSED);
    this._rejectPendingRequests(error);
  }

  public send<Result = unknown>(
    method: string,
    parameters: unknown[],
    options?: { timeout?: number },
  ): Promise<Result> {
    return new Promise((resolve, reject) => {
      const request = this._createRequest(method, parameters);

      const executeRequest = () => {
        const timeout = options?.timeout ?? this._options.requestTimeout;
        const timeoutId = this._setRequestTimeout(request.id, timeout);

        this._pendingRequests.set(request.id, { resolve, reject, timeoutId });
        try {
          this._conn!.send(JSON.stringify(request));
        } catch (error) {
          if (timeoutId) clearTimeout(timeoutId);
          this._pendingRequests.delete(request.id);
          reject(error);
        }
      };

      if (this._state === 'connecting') {
        this._requestQueue.push({ resolve, reject, request: executeRequest });
      } else if (this._state === 'connected') {
        executeRequest();
      } else if (this._state === 'disconnected') {
        reject(new Error(ERRORS.DISCONNECTED_SEND));
      } else if (this._state === 'failed') {
        reject(new Error(ERRORS.FAILED_SEND));
      }
    });
  }

  public async subscribe<Error = unknown, Result = unknown>(
    method: string,
    unsubscribeMethod: string,
    parameters: unknown[],
    callback: ISubscriptionCallback<Error, Result>,
  ): Promise<() => void> {
    const request = this._createRequest(method, parameters);

    const executeSubscription = () => {
      const subscription: ISubscriptionParameters<Error, Result> = {
        isInitialized: false,
        callback,
      };
      this._subscriptions.set(request.id, subscription);
      try {
        // TODO: check for connection before sending request
        this._conn!.send(JSON.stringify(request));
      } catch (error) {
        this._subscriptions.delete(request.id);
        throw error;
      }
    };

    if (this._state === 'connected') {
      executeSubscription();
    } else if (this._state === 'disconnected') {
      throw new Error(ERRORS.DISCONNECTED_SUBSCRIBE);
    } else if (this._state === 'failed') {
      throw new Error(ERRORS.FAILED_SUBSCRIBE);
    } else if (this._state === 'connecting') {
      await new Promise<void>((resolve, reject) => {
        this._requestQueue.push({
          resolve,
          reject,
          request: () => {
            executeSubscription();
            resolve();
          },
        });
      });
    }

    return () => this.unsubscribe(request.id, unsubscribeMethod);
  }

  private unsubscribe(requestId: number, unsubscribeMethod: string): void {
    const subscriptionId = this._subscriptionIds.get(requestId);

    if (!subscriptionId) {
      return;
    }

    const request = this._createRequest(unsubscribeMethod, [subscriptionId]);

    this._conn!.send(JSON.stringify(request));

    this._subscriptions.delete(subscriptionId);
    this._subscriptionIds.delete(requestId);
  }
}
