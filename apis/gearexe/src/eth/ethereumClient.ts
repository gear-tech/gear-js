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

export class EthereumClient<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TAccount extends Account = Account,
> {
  public readonly publicClient: PublicClient<TTransport, TChain, undefined>;
  private _walletClient: WalletClient<TTransport, TChain, TAccount>;

  constructor(publicClient: PublicClient, walletClient: WalletClient) {
    this.publicClient = publicClient as PublicClient<TTransport, TChain, undefined>;
    this._walletClient = walletClient as WalletClient<TTransport, TChain, TAccount>;
  }

  public get walletClient() {
    if (!this._walletClient) {
      throw new Error('Wallet client not connected');
    }
    return this._walletClient;
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
}
