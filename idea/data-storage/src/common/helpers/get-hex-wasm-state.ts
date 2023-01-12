import { CreateType, Hex } from '@gear-js/api';

export function getHexWasmState(wasmStateBuff: Buffer): Hex {
  return CreateType.create('Bytes', wasmStateBuff).toHex();
}
