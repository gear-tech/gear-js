import { HexString } from '@polkadot/util/types';
import { generateCodeHash } from '@gear-js/api';
import * as dotenv from 'dotenv';

dotenv.config();

export function getCodeHash(wasmStateBuff: Buffer): HexString {
  if(process.env.TEST_ENV_UNIT) return 'hex' as HexString;

  return generateCodeHash(wasmStateBuff);
}
