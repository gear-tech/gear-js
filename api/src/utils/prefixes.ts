import { StorageKey, Vec } from '@polkadot/types';
import { AnyTuple } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { stringToHex } from '@polkadot/util';

export const GPROG = 'g::prog::';
export const GPAGES = 'g::pages::';
export const GPROG_HEX = stringToHex(GPROG).slice(2);
export const GPAGES_HEX = stringToHex(GPAGES).slice(2);

export function getIdsFromKeys(keys: Vec<StorageKey<AnyTuple>>, prefix: string): HexString[] {
  return keys.map((key) => '0x' + key.toHex().slice(prefix.length)) as HexString[];
}
