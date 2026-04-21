import type { Address, Hash, Hex, TransactionRequest, WalletClient } from 'viem';
import { isHex, parseSignature, slice } from 'viem';

import type { ITransactionSigner, SignTypedDataParams, SignTypedDataResult } from '../../types/signer.js';
import { SigningError } from '../errors.js';

export class WalletClientAdapter implements ITransactionSigner {
  constructor(private _wc: WalletClient) {}

  private get _account() {
    if (!this._wc.account) {
      throw new SigningError('Wallet client has no account');
    }

    return this._wc.account;
  }

  async signMessage(data: Uint8Array | Hash): Promise<Hash> {
    const messageData = typeof data === 'string' && isHex(data) ? (data as Hex) : (data as Uint8Array);

    return this._wc.signMessage({
      message: { raw: messageData },
      account: this._account,
    });
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

  async signTypedData({ message, types, primaryType, domain }: SignTypedDataParams): Promise<SignTypedDataResult> {
    const signature = await this._wc.signTypedData({ message, types, primaryType, domain, account: this._account });

    const { r, v, s, yParity } = parseSignature(signature);
    return { signature, r, s, v: v ? Number(v) : yParity === 0 ? 27 : 28 };
  }
}

export function walletClientToSigner(walletClient: WalletClient): WalletClientAdapter {
  return new WalletClientAdapter(walletClient);
}
