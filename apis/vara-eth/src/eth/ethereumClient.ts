import type { Address, PublicClient } from 'viem';

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
  private _isInitialized: boolean;

  constructor(
    public readonly publicClient: PublicClient,
    private _signer: ISigner,
    routerAddress: Address,
  ) {
    this._isInitialized = false;
    this._routerClient = getRouterClient(routerAddress, _signer, this.publicClient);

    this._initPromise = this._init();
  }

  private async _init() {
    const [chainId, wvaraAddress] = await Promise.all([
      this.publicClient.getChainId(),
      this._routerClient.wrappedVara(),
    ]);
    this._chainId = chainId;
    this._wvaraClient = getWrappedVaraClient(wvaraAddress, this._signer, this.publicClient);

    this._isInitialized = true;
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
    if (!this._isInitialized) {
      throw new Error(
        'EthereumClient not yet initialized. Await ethereumClient.waitForInitialization() before setting the signer.',
      );
    }
    this._signer = signer;
    this._routerClient.setSigner(signer);
    this._wvaraClient.setSigner(signer);
    return this;
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

  get blockDuration(): number {
    if (this._chainId in TARGET_BLOCK_TIMES) {
      return TARGET_BLOCK_TIMES[this._chainId];
    }
    throw new Error(`Unsupported chain ID: ${this._chainId}`);
  }

  get signer() {
    if (!this._signer) {
      throw new Error('Signer not set');
    }
    return this._signer;
  }
}
