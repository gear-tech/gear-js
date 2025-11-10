import { Provider } from 'ethers';
import { ISigner, IGearExeProvider, InjectedTransaction } from '../types/index.js';
import { query, Query } from './query/index.js';
import { call, Call } from './call/index.js';
import { Injected } from './injected.js';

export class GearExeApi {
  private _provider: IGearExeProvider;
  public readonly query: Query;
  public readonly call: Call;
  private _signer?: ISigner;

  constructor(
    provider: IGearExeProvider,
    // TODO: should be replaced with abstract class
    private _ethProvider?: Provider,
  ) {
    this._provider = provider;

    this._setProps('query', query);
    this._setProps('call', call);

    delete this._setProps;
  }

  private _setProps(thisProperty: string, modules: Record<string, any>) {
    const properties = {};
    for (const [key, value] of Object.entries(modules)) {
      properties[key] = new value(this._provider);
    }
    this[thisProperty] = properties;
  }

  get provider() {
    return this._provider;
  }

  public setSigner(signer: ISigner): this {
    this._signer = signer;
    return this;
  }

  sendInjectedTransaction(tx: InjectedTransaction, signer?: ISigner) {
    if (!this._ethProvider) {
      // TODO: consider checking tx.referenceBlock
      // for now there is no necessity in provider if it's set
      throw new Error('Eth provider is not set');
    }
    const injectedTx = new Injected(this.provider, this._ethProvider, tx, this._signer || signer);

    return injectedTx;
  }
}
