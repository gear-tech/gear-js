import { HexString } from '@polkadot/util/types';
import { Keyring } from '@polkadot/api';
import { u8aToHex } from '@polkadot/util';

export function decodeAddress(publicKey: string): HexString {
  return u8aToHex(new Keyring().decodeAddress(publicKey));
}

export function encodeAddress(publicKeyRaw: string | Uint8Array): string {
  return new Keyring().encodeAddress(publicKeyRaw);
}
