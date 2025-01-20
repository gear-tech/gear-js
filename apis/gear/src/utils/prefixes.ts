import { StorageKey, Vec } from '@polkadot/types';
import { AnyTuple } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

export function getIdsFromKeys(keys: Vec<StorageKey<AnyTuple>>, prefix: string): HexString[] {
  return keys.map((key) => '0x' + key.toHex().slice(prefix.length)) as HexString[];
}
