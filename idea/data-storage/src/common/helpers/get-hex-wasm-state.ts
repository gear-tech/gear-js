import { CreateType, Hex } from '@gear-js/api';
import * as dotenv from 'dotenv';

dotenv.config();

export function getHexWasmState(wasmStateBuff: Buffer): Hex {
  if(process.env.TEST_ENV_UNIT) return 'hex' as Hex;

  return CreateType.create('Bytes', wasmStateBuff).toHex();
}
