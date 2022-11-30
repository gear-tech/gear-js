import { isHex, isU8a, u8aToHex } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';
import { Codec } from '@polkadot/types/types';

import { CreateType } from './CreateType';

export function createPayload(payload: unknown, type: string, types: HexString): HexString | Uint8Array | Codec {
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
