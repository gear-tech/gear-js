import { HexString } from '@polkadot/util/types';
import { generateCodeHash } from '@gear-js/api';

export function generateMetaHash(hex: HexString): HexString {
  if (process.env.TEST_ENV_UNIT) return '0x00';

  return generateCodeHash(hex);
}
