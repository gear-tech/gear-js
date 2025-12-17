import { Account, Address, Chain, Hex, PublicClient, Transport, WalletClient } from 'viem';

import { getRouterClient, RouterClient } from './router';
import { getWrappedVaraClient, WrappedVaraClient } from './wrappedVara';

const TARGET_BLOCK_TIMES: Record<number, number> = {
  1: 12,
  560048: 12,
  31337: 1,
};

export class EthereumClient<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TAccount extends Account = Account,
> {
  public readonly publicClient: PublicClient<TTransport, TChain>;
  private _walletClient: WalletClient<TTransport, TChain, TAccount>;
  private _chainId: number;
  private _routerClient: RouterClient<TTransport, TChain, TAccount>;
  private _wvaraClient: WrappedVaraClient<TTransport, TChain, TAccount>;
  private _initPromise: Promise<boolean>;

  constructor(publicClient: PublicClient, walletClient: WalletClient, routerAddress: Address) {
    this.publicClient = publicClient as PublicClient<TTransport, TChain>;
    this._walletClient = walletClient as WalletClient<TTransport, TChain, TAccount>;

    this._routerClient = getRouterClient(routerAddress, this._walletClient, this.publicClient);

    this._initPromise = this._init();
  }

  private async _init() {
    const [chainId, wvaraAddress] = await Promise.all([
      this.publicClient.getChainId(),
      this._routerClient.wrappedVara(),
    ]);
    this._chainId = chainId;
    this._wvaraClient = getWrappedVaraClient(wvaraAddress, this.walletClient, this.publicClient);

    return true;
  }

  public get isInitialized(): Promise<boolean> {
    return this._initPromise;
  }

  public get walletClient() {
    if (!this._walletClient) {
      throw new Error('Wallet client not connected');
    }
    return this._walletClient;
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

  public setWalletClient(client: WalletClient) {
    this._walletClient = client as WalletClient<TTransport, TChain, TAccount>;
    return this;
  }

  get accountAddress() {
    if (!this.walletClient || !this.walletClient.account) {
      throw new Error('Wallet client not connected');
    }
    return this.walletClient.account.address;
  }

  get account() {
    if (!this.walletClient || !this.walletClient.account) {
      throw new Error('Wallet client not connected');
    }
    return this.walletClient.account;
  }

  async getBlockNumber() {
    const bn = await this.publicClient.getBlockNumber();

    return Number(bn);
  }

  getBlock(blockNumber: number) {
    return this.publicClient.getBlock({ blockNumber: BigInt(blockNumber) });
  }

  async signMessage(data: Hex) {
    return this.walletClient.signMessage({ message: { raw: data }, account: this.account });
  }

  get blockDuration(): number {
    if (this._chainId in TARGET_BLOCK_TIMES) {
      return TARGET_BLOCK_TIMES[this._chainId];
    }
    throw new Error(`Unsupported chain ID: ${this._chainId}`);
  }
}
