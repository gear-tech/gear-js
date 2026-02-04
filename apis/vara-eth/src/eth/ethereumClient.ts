import type { Address, Hex, PublicClient } from 'viem';

import { getWrappedVaraClient, type WrappedVaraClient } from './wrappedVara.js';
import { getRouterClient, type RouterClient } from './router.js';
import { ISigner } from '../types/signer.js';

const TARGET_BLOCK_TIMES: Record<number, number> = {
  1: 12,
  560048: 12,
  31337: 1,
};

export class EthereumClient {
  private _chainId: number;
  private _routerClient: RouterClient;
  private _wvaraClient: WrappedVaraClient;
  private _initPromise: Promise<boolean>;

  constructor(
    public readonly publicClient: PublicClient,
    public signer: ISigner,
    routerAddress: Address,
  ) {
    this._routerClient = getRouterClient(routerAddress, signer, this.publicClient);

    this._initPromise = this._init();
  }

  private async _init() {
    const [chainId, wvaraAddress] = await Promise.all([
      this.publicClient.getChainId(),
      this._routerClient.wrappedVara(),
    ]);
    this._chainId = chainId;
    this._wvaraClient = getWrappedVaraClient(wvaraAddress, this.signer, this.publicClient);

    return true;
  }

  public waitForInitialization(): Promise<boolean> {
    return this._initPromise;
  }

  public get router() {
    return this._routerClient;
  }

  public get wvara() {
    if (!this._wvaraClient) {
      throw new Error('EthereumClient not yet initialized. Await ethereumClient.isInitialized before accessing wvara.');
    }

    return this._wvaraClient;
  }

  public setSigner(signer: ISigner) {
    this.signer = signer;
    this._routerClient.setSigner(signer);
    this._wvaraClient.setSigner(signer);
    return this;
  }

  public getAccountAddress(): Promise<Address> {
    if (!this.signer) {
      throw new Error('Signer is not provided.');
    }
    return this.signer.getAddress();
  }

  async getBlockNumber() {
    const bn = await this.publicClient.getBlockNumber();

    return Number(bn);
  }

  getBlock(blockNumber: number) {
    return this.publicClient.getBlock({ blockNumber: BigInt(blockNumber) });
  }

  async getLatestBlockTimestamp() {
    const block = await this.publicClient.getBlock({ blockTag: 'latest' });
    return Number(block.timestamp);
  }

  async signMessage(data: Hex) {
    return this.signer.signMessage(data);
  }

  get blockDuration(): number {
    if (this._chainId in TARGET_BLOCK_TIMES) {
      return TARGET_BLOCK_TIMES[this._chainId];
    }
    throw new Error(`Unsupported chain ID: ${this._chainId}`);
  }
}
