import type { Hash, TransactionRequest } from 'viem';

import type { ITransactionSigner, SignTypedDataParams, SignTypedDataResult } from '../../types/signer.js';
import { SigningError } from '../errors.js';

/**
 * A signer that delegates to whatever signer is returned by the provided getter at call time.
 * Useful in reactive environments (e.g. React) where the underlying wallet client can change
 * without wanting to recreate the EthereumClient or MirrorClient instances.
 *
 * @example
 * ```ts
 * // Create once
 * const signer = new DynamicSigner(() =>
 *   walletClient ? walletClientToSigner(walletClient) : undefined
 * );
 * ethClient.setSigner(signer);
 *
 * // Later, when walletClient changes — just update the variable.
 * // No setSigner call needed.
 * walletClient = newWalletClient;
 * ```
 */
export class DynamicSigner implements ITransactionSigner {
  constructor(private _getSigner: () => ITransactionSigner | undefined) {}

  private get _signer(): ITransactionSigner {
    const signer = this._getSigner();
    if (!signer) {
      throw new SigningError('No signer available');
    }
    return signer;
  }

  async signMessage(message: Uint8Array | string): Promise<Hash> {
    return this._signer.signMessage(message);
  }

  async getAddress() {
    return this._signer.getAddress();
  }

  async sendTransaction(tx: TransactionRequest): Promise<Hash> {
    return this._signer.sendTransaction(tx);
  }

  async signTypedData(params: SignTypedDataParams): Promise<SignTypedDataResult> {
    return this._signer.signTypedData(params);
  }
}
