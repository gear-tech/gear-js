import type {
  Abi,
  Address,
  ContractFunctionArgs,
  ContractFunctionName,
  PublicClient,
  ReadContractReturnType,
} from 'viem';

import type { ITransactionSigner } from '../../types/signer.js';

export interface ContractClientParams<abi extends Abi = Abi> {
  /**
   * The contract address
   */
  address: Address;
  /**
   * Viem's PublicClient instance for reading contract data
   */
  publicClient: PublicClient;
  /**
   * The ABI of the contract
   */
  abi: abi;
  /**
   * (optional) Signer for signing and sending transactions
   */
  signer?: ITransactionSigner;
}

/** Abstract base class for all contract clients. Holds the address, public client, signer, and ABI. */
export abstract class BaseContractClient<const abi extends Abi> {
  /**
   * The contract address
   */
  public readonly address: Address;
  protected _pc: PublicClient;
  protected _signer?: ITransactionSigner;
  protected _abi: abi;

  constructor(params: ContractClientParams<abi>) {
    this.address = params.address;
    this._pc = params.publicClient;
    this._signer = params.signer;
    this._abi = params.abi;
  }

  /**
   * Sets the signer used to sign and send transactions.
   * @param signer - Signer implementation
   * @returns `this` for chaining
   */
  public setSigner(signer: ITransactionSigner) {
    this._signer = signer;
    return this;
  }

  /**
   * Removes the current signer, making the client read-only.
   * @returns `this` for chaining
   */
  public resetSigner() {
    this._signer = undefined;
    return this;
  }

  /**
   * Returns the current signer, throwing if none is set.
   * @throws {Error} When no signer has been provided
   */
  protected _ensureSigner(): ITransactionSigner {
    if (!this._signer) {
      throw new Error('Signer is not provided');
    }

    return this._signer;
  }

  /**
   * Calls a view or pure function on the contract.
   * @param functionName - ABI function name
   * @param args - Function arguments
   * @returns Decoded return value
   */
  protected read<
    functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
    const args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  >(functionName: functionName, args?: args): Promise<ReadContractReturnType<abi, functionName, args>> {
    return this._pc.readContract({
      address: this.address,
      abi: this._abi,
      functionName,
      args,
    });
  }
}
