import { Codec } from '@polkadot/types/types';
import { isHex, isU8a, u8aToHex } from '@polkadot/util';

import { Hex } from '../types';
import { CreateType } from './CreateType';

export function createPayload(payload: unknown, type: string, types: Hex | Uint8Array): Hex | Uint8Array | Codec {
  if (payload === undefined) {
    return '0x';
  }
  if (isHex(payload)) {
    return payload;
  }
  if (isU8a(payload)) {
    return u8aToHex(payload);
  }
  return CreateType.create(type, payload, types).toHex();
}
