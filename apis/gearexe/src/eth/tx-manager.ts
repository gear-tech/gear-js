import { TransactionReceipt, TransactionRequest, TransactionResponse, Wallet } from 'ethers';

export class TxManager {
  private _receipt: TransactionReceipt;
  private _response: TransactionResponse;

  constructor(
    private _wallet: Wallet,
    private _tx: TransactionRequest,
    txDependentHelperFns?: Record<string, (manager: TxManager) => (...args: any[]) => Promise<any> | any>,
    txIndependentHelperFns?: Record<string, (...args: any[]) => Promise<any> | any>,
  ) {
    Object.entries(txDependentHelperFns).forEach(([name, fn]) => {
      this[name] = fn(this);
    });

    Object.entries(txIndependentHelperFns).forEach(([name, fn]) => {
      this[name] = fn;
    });
  }

  async estimateGas(): Promise<bigint> {
    this._tx.gasLimit = await this._wallet.estimateGas(this._tx);

    return this._tx.gasLimit;
  }

  async send(): Promise<TransactionResponse> {
    this._response = await this._wallet.sendTransaction(this._tx);
    return this._response;
  }

  async sendAndWaitForReceipt(): Promise<TransactionReceipt> {
    const response = await this.send();
    this._receipt = await response.wait();
    return this._receipt;
  }

  async getReceipt(): Promise<TransactionReceipt> {
    return this._receipt || this._response.wait();
  }

  getTx(): TransactionRequest {
    return this._tx;
  }
}
