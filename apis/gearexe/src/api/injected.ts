import { Provider } from 'ethers';

import { ISigner, IGearExeProvider, InjectedTransaction } from '../types/index.js';
import { HexString } from 'gear-js-util';

export class Injected {
  constructor(
    private _gearExeProvider: IGearExeProvider,
    private _ethProvider: Provider, // TODO: replace with provider adapter
    private tx: InjectedTransaction,
    private _signer?: ISigner,
  ) {}

  public setSigner(signer: ISigner): this {
    this._signer = signer;
    return this;
  }

  private async setReferenceBlock() {
    const latestBlockNumber = await this._ethProvider.getBlockNumber();
    const blockNumber = latestBlockNumber - 3; // TODO: move to consts, explain why such value

    const block = await this._ethProvider.getBlock(blockNumber);
    this.tx.setReferenceBlock(block.hash as HexString);
  }

  public async send() {
    if (!this._signer) {
      throw new Error('Signer is required to send transaction');
    }

    if (!this.tx.referenceBlock) {
      await this.setReferenceBlock();
    }

    const pubKey = await this._signer.getAddress();
    const signature = await this._signer.signMessage(this.tx.hash);

    const result = await this._gearExeProvider.send('injected_sendTransaction', [
      {
        data: this.tx.data,
        signature,
        public_key: pubKey,
      },
    ]);

    // TODO: figure out what should be returned here
    return result;
  }

  // TODO: method to send and subscribe to transaction updataes
}
