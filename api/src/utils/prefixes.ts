import { StorageKey, Vec } from '@polkadot/types';
import { AnyTuple } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

export const GPROG = 'g::prog::';
export const GPAGES = 'g::pages::';
export const GPROG_HEX = Buffer.from(GPROG).toString('hex');
export const GPAGES_HEX = Buffer.from('g::pages::').toString('hex');

export function getIdsFromKeys(keys: Vec<StorageKey<AnyTuple>>, prefix: string): HexString[] {
  return keys.map((key) => '0x' + key.toHex().slice(prefix.length)) as HexString[];
}
