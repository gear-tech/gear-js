import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

export function validateAddress(address: string) {
  try {
    const u8aAddr = decodeAddress(address);
    if (u8aAddr.length !== 32) {
      throw new Error('Invalid address');
    }
    return u8aToHex(u8aAddr);
  } catch (_) {
    throw new Error('Invalid address');
  }
}
