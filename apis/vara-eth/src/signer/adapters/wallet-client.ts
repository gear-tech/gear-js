import type { Hash, TransactionRequest, WalletClient, Hex, Address } from 'viem';
import { isHex } from 'viem';

import { SigningError, AddressError } from '../errors.js';
import type { ISigner } from '../../types/signer.js';

export class WalletClientAdapter implements ISigner {
  constructor(private _wc: WalletClient) {}

  getId(): string {
    return this._wc.uid;
  }

  async signMessage(data: Uint8Array | Hash): Promise<Hash> {
    if (!this._wc.account) {
      throw new SigningError('Wallet client has no account');
    }
    const messageData = typeof data === 'string' && isHex(data) ? (data as Hex) : (data as Uint8Array);
    return this._wc.signMessage({
      message: { raw: messageData },
      account: this._wc.account,
    });
  }

  async getAddress(): Promise<Address> {
    if (!this._wc.account) {
      throw new AddressError('Wallet client has no account');
    }
    return this._wc.account.address;
  }

  async sendTransaction(tx: TransactionRequest): Promise<Hash> {
    if (!this._wc.account) {
      throw new SigningError('Wallet client has no account');
    }
    return this._wc.sendTransaction({
      ...tx,
      account: this._wc.account,
      chain: this._wc.chain ?? null,
    });
  }
}

export function walletClientToSigner(walletClient: WalletClient): WalletClientAdapter {
  return new WalletClientAdapter(walletClient);
}
