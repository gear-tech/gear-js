import type { EthereumClient } from '../eth/index.js';
import type { IInjectedTransaction, IVaraEthProvider, IVaraEthValidatorPoolProvider } from '../types/index.js';
import { type Call, call } from './call/index.js';
import { InjectedTx } from './injected/index.js';
import { type Query, query } from './query/index.js';

export class VaraEthApi {
  private _provider: IVaraEthProvider | IVaraEthValidatorPoolProvider;
  private _rpcVersion: string | null = null;

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

    this._setProps = undefined;
  }

  static async create(
    provider: IVaraEthProvider | IVaraEthValidatorPoolProvider,
    ethClient?: EthereumClient,
  ): Promise<VaraEthApi> {
    const api = new VaraEthApi(provider, ethClient);
    api._rpcVersion = await api.query.info.version();
    return api;
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

  get eth(): EthereumClient {
    if (!this._ethClient) {
      throw new Error('EthereumClient is not set');
    }
    return this._ethClient;
  }

  async createInjectedTransaction(tx: IInjectedTransaction): Promise<InjectedTx> {
    if (!this._ethClient) {
      throw new Error('Eth client is not set');
    }

    const injectedTx = new InjectedTx(this.provider, this._ethClient, tx, this._rpcVersion);

    if (!tx.referenceBlock) {
      await injectedTx.setReferenceBlock();
    }

    return injectedTx;
  }

  get rpcVersion(): string | null {
    return this._rpcVersion;
  }
}
