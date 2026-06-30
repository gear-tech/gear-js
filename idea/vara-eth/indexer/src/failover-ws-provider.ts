import { createLogger } from '@gear-js/logger';
import { type ISubscriptionCallback, type IVaraEthProvider, type WsUrl, WsVaraEthProvider } from '@vara-eth/api';

const logger = createLogger('vara-eth-ws');

export class FailoverWsProvider implements IVaraEthProvider {
  private _currentIndex = 0;
  private _current: WsVaraEthProvider;

  constructor(private readonly _urls: WsUrl[]) {
    if (_urls.length === 0) throw new Error('At least one node URL required');
    this._current = this._createProvider(0);
  }

  private _createProvider(index: number): WsVaraEthProvider {
    const url = this._urls[index];
    // reconnectAttempts: 0 — no internal retries; we handle failover ourselves.
    // This ensures 'error' fires once, _rejectPendingRequests is called immediately,
    // and there are no zombie retry timeouts racing with our disconnect() call.
    const provider = new WsVaraEthProvider(url, { autoConnect: false, reconnectAttempts: 0 });

    const onFailure = () => {
      if (this._current === provider) this._switchToNext();
    };

    provider.on('connected', () => {
      logger.info(`Connected to Vara.Eth node ${url}`);
    });
    provider.on('disconnected', onFailure);
    provider.on('error', onFailure);

    provider.connect().catch(() => {
      // Handled via 'error' event above
    });

    return provider;
  }

  private _switchToNext(): void {
    const nextIndex = (this._currentIndex + 1) % this._urls.length;
    logger.error(`Vara.Eth node ${this._urls[this._currentIndex]} unavailable, switching to ${this._urls[nextIndex]}`);
    const old = this._current;
    this._currentIndex = nextIndex;
    this._current = this._createProvider(nextIndex);
    // Deferred to avoid calling disconnect() from within the provider's own event handler
    setTimeout(() => old.disconnect().catch(() => {}), 0);
  }

  connect(): Promise<void> {
    return this._current.connect();
  }

  disconnect(): Promise<void> {
    return this._current.disconnect();
  }

  send<Result = unknown>(method: string, parameters: unknown[], options?: { timeout?: number }): Promise<Result> {
    return this._current.send<Result>(method, parameters, options);
  }

  subscribe<E = unknown, R = unknown>(
    method: string,
    unsubscribeMethod: string,
    parameters: unknown[],
    callback: ISubscriptionCallback<E, R>,
  ): Promise<() => void> {
    return this._current.subscribe(method, unsubscribeMethod, parameters, callback);
  }
}
