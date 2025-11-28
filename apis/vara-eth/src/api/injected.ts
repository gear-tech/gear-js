import { Address, Hex } from 'viem';
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

  public async setRecipient(address?: Address) {
    const validators = await this.router.validators();

    if (address) {
      if (validators.includes(address)) {
        this.tx.setRecipient(address);
        return;
      }
      throw new Error('Address is not a validator');
    }

    const slot = Date.now() / this._ethClient.blockDuration;

    const validatorIndex = slot % validators.length;

    this.tx.setRecipient(validators[validatorIndex]);
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

    await this._sign();

    if (!this.tx.recipient) {
      await this.setRecipient();
    }

    const result = await this._varaethProvider.send<string>('injected_sendTransaction', this._rpcData);

    return result;
  }

  public async sendAndWaitForPromise(): Promise<IInjectedTransactionPromise> {
    if (!this.tx.referenceBlock) {
      await this.setReferenceBlock();
    }

    await this._sign();

    if (!this.tx.recipient) {
      await this.setRecipient();
    }

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
