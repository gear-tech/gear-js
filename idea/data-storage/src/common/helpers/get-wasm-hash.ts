import { generateCodeHash, Hex } from '@gear-js/api';
import * as dotenv from 'dotenv';

dotenv.config();

export function getCodeHash(wasmStateBuff: Buffer): Hex {
  if(process.env.TEST_ENV_UNIT) return 'hex' as Hex;

  return generateCodeHash(wasmStateBuff);
}
