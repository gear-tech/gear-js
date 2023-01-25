import { Keyring } from '@polkadot/api';
import { u8aToHex } from '@polkadot/util';

import { Hex } from '../types';

export function decodeAddress(publicKey: string): Hex {
  return u8aToHex(new Keyring().decodeAddress(publicKey));
}

export function encodeAddress(publicKeyRaw: string | Uint8Array): string {
  return new Keyring().encodeAddress(publicKeyRaw);
}
