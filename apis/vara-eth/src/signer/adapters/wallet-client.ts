import type { Address, Hash, Hex, Signature, TransactionRequest, WalletClient } from 'viem';
import { isHex, parseSignature } from 'viem';

import type { ITransactionSigner, SignTypedDataParams } from '../../types/signer.js';
import { SigningError } from '../errors.js';

/**
 * Adapts a viem `WalletClient` to the {@link ITransactionSigner} interface.
 * Use {@link walletClientToSigner} as the preferred factory.
 */
export class WalletClientAdapter implements ITransactionSigner {
  constructor(private _wc: WalletClient) {}

  private get _account() {
    if (!this._wc.account) {
      throw new SigningError('Wallet client has no account');
    }

    return this._wc.account;
  }

  async signMessage(data: Uint8Array | string): Promise<Hash> {
    const message =
      typeof data === 'string'
        ? isHex(data)
          ? { raw: data as Hex }
          : data
        : { raw: data };

    return this._wc.signMessage({ message, account: this._account });
  }

  async getAddress(): Promise<Address> {
    return this._account.address;
  }

  async sendTransaction(tx: TransactionRequest): Promise<Hash> {
    return this._wc.sendTransaction({
      ...tx,
      account: this._account,
      chain: this._wc.chain,
    });
  }

  async signTypedData({ message, types, primaryType, domain }: SignTypedDataParams): Promise<Signature> {
    const signature = await this._wc.signTypedData({ message, types, primaryType, domain, account: this._account });

    return parseSignature(signature);
  }
}

/**
 * Creates a {@link WalletClientAdapter} from a viem `WalletClient`.
 *
 * @param walletClient - The viem wallet client to adapt
 * @returns A signer adapter wrapping the provided wallet client
 */
export function walletClientToSigner(walletClient: WalletClient): WalletClientAdapter {
  return new WalletClientAdapter(walletClient);
}
