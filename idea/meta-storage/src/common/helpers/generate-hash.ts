import { generateCodeHash } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

export function generateHash(hex: HexString): HexString {
  return generateCodeHash(hex);
}
