import { Address, PublicClient } from 'viem';
import { ITransactionSigner } from '../types/signer.js';

export interface ContractClientParams {
  /**
   * The contract address
   */
  address: Address;
  /**
   * Viem's PublicClient instance for reading contract data
   */
  publicClient: PublicClient;
  /**
   * (optional) Signer for signing and sending transactions
   */
  signer?: ITransactionSigner;
}

export abstract class BaseContractClient {
  /**
   * The contract address
   */
  public readonly address: Address;
  protected _pc: PublicClient;
  protected _signer?: ITransactionSigner;

  constructor(params: ContractClientParams) {
    this.address = params.address;
    this._pc = params.publicClient;
    this._signer = params.signer;
  }

  public setSigner(signer: ITransactionSigner) {
    this._signer = signer;
    return this;
  }

  public resetSigner() {
    this._signer = undefined;
    return this;
  }

  protected _ensureSigner(): ITransactionSigner {
    if (!this._signer) {
      throw new Error('Signer is not provided');
    }

    return this._signer;
  }
}
