import type { EthereumClient } from '../eth/index.js';
import type { IInjectedTransaction, IVaraEthProvider, IVaraEthValidatorPoolProvider } from '../types/index.js';
import { call, type Call } from './call/index.js';
import { Injected } from './injected.js';
import { query, type Query } from './query/index.js';

export class VaraEthApi {
  private _provider: IVaraEthProvider | IVaraEthValidatorPoolProvider;
  public readonly query!: Query;
  public readonly call!: Call;

  constructor(
    provider: IVaraEthProvider | IVaraEthValidatorPoolProvider,
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

  async createInjectedTransaction(tx: IInjectedTransaction): Promise<Injected> {
    if (!this._ethClient) {
      throw new Error('Eth client is not set');
    }

    const injectedTx = new Injected(this.provider, this._ethClient, tx);

    if (!tx.referenceBlock) {
      await injectedTx.setReferenceBlock();
    }

    return injectedTx;
  }
}
