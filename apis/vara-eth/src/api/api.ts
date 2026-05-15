import type { EthereumClient } from '../eth/index.js';
import type { IInjectedTransaction, IVaraEthProvider, IVaraEthValidatorPoolProvider } from '../types/index.js';
import { type Call, call } from './call/index.js';
import { FeesNamespace } from './fees/index.js';
import { InjectedTx } from './injected/index.js';
import { ProgramsNamespace } from './programs/index.js';
import { type Query, query } from './query/index.js';
import { StreamNamespace } from './stream/index.js';

/**
 * Builds a Proxy that intercepts every property access and throws a clear
 * error. Used for `api.programs` / `api.fees` when no EthereumClient is wired
 * in. Access fails at call time with a self-explanatory message rather than
 * a `TypeError: undefined is not a function`.
 */
function noEthClientStub(namespace: string): never {
  // Returned via Proxy; TS sees `never` since every access throws.
  throw new Error(
    `api.${namespace} is unavailable: no EthereumClient was wired in. Use createVaraEthApi(...) to construct.`,
  );
}

function makeNoEthClientProxy(namespace: string): never {
  return new Proxy(
    {},
    {
      get: (_t, prop) => () => noEthClientStub(`${namespace}.${String(prop)}`),
    },
  ) as never;
}

export class VaraEthApi {
  private _provider: IVaraEthProvider | IVaraEthValidatorPoolProvider;
  public readonly query!: Query;
  public readonly call!: Call;
  /**
   * High-level program operations: `deploy` and `sendAndWait`.
   * Available only when an {@link EthereumClient} is wired in (i.e. the api was
   * created via `createVaraEthApi`). Accessing a method when no EthereumClient
   * is set throws a clear error.
   */
  public readonly programs!: ProgramsNamespace;
  /**
   * Fee-estimation helpers.
   * Available only when an {@link EthereumClient} is wired in.
   */
  public readonly fees!: FeesNamespace;
  /**
   * Typed event streams over Router and Mirror contracts, plus block headers.
   * Available only when an {@link EthereumClient} is wired in.
   */
  public readonly stream!: StreamNamespace;

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

    if (this._ethClient) {
      Object.assign(this, {
        programs: new ProgramsNamespace(this._ethClient, (tx) => this.createInjectedTransaction(tx)),
        fees: new FeesNamespace(this._ethClient),
        stream: new StreamNamespace(this._ethClient),
      });
    } else {
      Object.assign(this, {
        programs: makeNoEthClientProxy('programs'),
        fees: makeNoEthClientProxy('fees'),
        stream: makeNoEthClientProxy('stream'),
      });
    }
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

    const injectedTx = new InjectedTx(this.provider, this._ethClient, tx);

    if (!tx.referenceBlock) {
      await injectedTx.setReferenceBlock();
    }

    return injectedTx;
  }
}
