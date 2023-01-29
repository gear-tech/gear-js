import { HexString } from '@polkadot/util/types';
import { generateCodeHash, Hex } from '@gear-js/api';

export function generateCodeHashByApi(hex: HexString): Hex {
  if(process.env.TEST_ENV_UNIT) return '0x00';

  return  generateCodeHash(hex);
}
