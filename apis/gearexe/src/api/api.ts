import { EthereumClient } from '../eth/index.js';

import { IGearExeProvider, InjectedTransaction } from '../types/index.js';
import { query, Query } from './query/index.js';
import { call, Call } from './call/index.js';
import { Injected } from './injected.js';

export class GearExeApi {
  private _provider: IGearExeProvider;
  public readonly query!: Query;
  public readonly call!: Call;

  constructor(
    provider: IGearExeProvider,
    private _ethClient?: EthereumClient,
  ) {
    this._provider = provider;

    if (this._setProps) {
      this._setProps('query', query);
      this._setProps('call', call);
    }

    delete this._setProps;
  }

  private _setProps?(thisProperty: string, modules: Record<string, any>) {
    const properties = {};
    for (const [key, value] of Object.entries(modules)) {
      Object.assign(properties, { [key]: new value(this._provider) });
    }
    Object.assign(this, { [thisProperty]: properties });
  }

  get provider() {
    return this._provider;
  }

  sendInjectedTransaction(tx: InjectedTransaction) {
    if (!this._ethClient) {
      throw new Error('Eth client is not set');
    }
    const injectedTx = new Injected(this.provider, this._ethClient, tx);

    return injectedTx;
  }
}
