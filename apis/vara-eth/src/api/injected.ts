import { Hex } from 'viem';
import { IInjectedTransactionPromise, IVaraEthProvider, InjectedTransaction } from '../types/index.js';
import { EthereumClient, RouterContract } from '../eth/index.js';

type InjectedTransactionPromiseRaw = {
  data: {
    txHash: {
      hash: Hex;
    };
    reply: {
      payload: Hex;
      value: number;
      code:
        | {
            Success: string;
          }
        | { Error: string };
    };
  };
  signature: Hex;
};

export class Injected {
  private _signature: Hex;
  constructor(
    private _varaethProvider: IVaraEthProvider,
    private _ethClient: EthereumClient,
    private tx: InjectedTransaction,
    private router: RouterContract,
  ) {}

  async setReferenceBlock() {
    const latestBlockNumber = await this._ethClient.getBlockNumber();
    const blockNumber = latestBlockNumber - 3; // TODO: move to consts, explain why such value

    const block = await this._ethClient.getBlock(blockNumber);
    this.tx.setReferenceBlock(block.hash);
  }

  public async setRecipient() {
    const validators = await this.router.validators();
    // TODO: pick the right validator
    this.tx.setRecipient(validators[0]);
  }

  private async _sign() {
    this._signature = await this._ethClient.signMessage(this.tx.hash);
  }

  private get _rpcData() {
    return [
      {
        recipient: this.tx.recipient,
        tx: {
          data: this.tx.data,
          signature: this._signature,
          public_key: this._ethClient.accountAddress,
        },
      },
    ];
  }

  public async send(): Promise<string> {
    if (!this.tx.referenceBlock) {
      await this.setReferenceBlock();
    }

    if (!this.tx.recipient) {
      await this.setRecipient();
    }

    await this._sign();

    const result = await this._varaethProvider.send<string>('injected_sendTransaction', this._rpcData);

    return result;
  }

  public async sendAndWaitForPromise(): Promise<IInjectedTransactionPromise> {
    if (!this.tx.referenceBlock) {
      await this.setReferenceBlock();
    }

    if (!this.tx.recipient) {
      await this.setRecipient();
    }

    await this._sign();

    let unsub: (() => void) | undefined;

    const promise = new Promise<IInjectedTransactionPromise>((resolve, reject) => {
      this._varaethProvider
        .subscribe<unknown, InjectedTransactionPromiseRaw>(
          'injected_subscribeTransactionPromise',
          'injected_unsubscribeTransactionPromise',
          this._rpcData,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                txHash: result.data.txHash.hash,
                reply: result.data.reply,
                signature: result.signature,
              });
            }
          },
        )
        .then((unsubFn) => {
          unsub = unsubFn;
        })
        .catch(reject);
    });

    try {
      return await promise;
    } finally {
      if (unsub) {
        unsub();
      }
    }
  }
}
