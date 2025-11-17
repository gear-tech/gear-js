import { IGearExeProvider, InjectedTransaction } from '../types/index.js';
import { EthereumClient, RouterContract } from '../eth/index.js';

export class Injected {
  constructor(
    private _gearExeProvider: IGearExeProvider,
    private _ethClient: EthereumClient,
    private tx: InjectedTransaction,
    private router: RouterContract,
  ) {}

  private async setReferenceBlock() {
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

  public async send(): Promise<string> {
    if (!this.tx.referenceBlock) {
      await this.setReferenceBlock();
    }

    if (!this.tx.recipient) {
      await this.setRecipient();
    }

    const pubKey = this._ethClient.accountAddress;
    const signature = await this._ethClient.signMessage(this.tx.hash);

    const result = await this._gearExeProvider.send<string>('injected_sendTransaction', [
      {
        recipient: this.tx.recipient,
        tx: {
          data: this.tx.data,
          signature,
          public_key: pubKey,
        },
      },
    ]);

    return result;
  }

  // TODO: method to send and subscribe to transaction updataes
}
