import {
  Abi,
  Account,
  Chain,
  ContractFunctionArgs,
  ContractFunctionName,
  Hex,
  PublicClient,
  Transport,
  WalletClient,
} from 'viem';

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
  public readonly publicClient: PublicClient<TTransport, TChain, undefined>;
  private _walletClient: WalletClient<TTransport, TChain, TAccount>;
  private _chainId: number;

  constructor(publicClient: PublicClient, walletClient: WalletClient) {
    this.publicClient = publicClient as PublicClient<TTransport, TChain, undefined>;
    this._walletClient = walletClient as WalletClient<TTransport, TChain, TAccount>;

    this._init();
  }

  private async _init() {
    this._chainId = await this.publicClient.getChainId();
  }

  public get walletClient() {
    if (!this._walletClient) {
      throw new Error('Wallet client not connected');
    }
    return this._walletClient;
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

  async readContract<
    const abi extends Abi,
    functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
    const args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  >(address: Hex, abi: abi, fn: functionName, args?: args) {
    const result = await this.publicClient.readContract({
      address,
      abi,
      functionName: fn,
      args,
    });

    return result;
  }

  get simulateContract() {
    return this.publicClient.simulateContract;
  }

  get watchEvent() {
    return this.publicClient.watchContractEvent;
  }

  async getBlockNumber() {
    const bn = await this.publicClient.getBlockNumber();

    return Number(bn);
  }

  getBlock(blockNumber: number) {
    return this.publicClient.getBlock({ blockNumber: BigInt(blockNumber) });
  }

  async signMessage(data: string) {
    const sig = await this.walletClient.signMessage({ message: data, account: this.account });
    return sig;
  }

  get blockDuration(): number {
    if (this._chainId in TARGET_BLOCK_TIMES) {
      return TARGET_BLOCK_TIMES[this._chainId];
    }
    throw new Error(`Unsupported chain ID: ${this._chainId}`);
  }
}
