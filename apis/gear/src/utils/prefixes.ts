import type { StorageKey, Vec } from '@polkadot/types';
import type { AnyTuple } from '@polkadot/types/types';

import type { HexString } from '../types';

export function getIdsFromKeys(keys: Vec<StorageKey<AnyTuple>>, prefix: string): HexString[] {
  return keys.map((key) => `0x${key.toHex().slice(prefix.length)}`) as HexString[];
}
