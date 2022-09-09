import { Hex } from '../types';
import { TypeInfoRegistry } from './TypeInfoReg';

export function decodeHexTypes(hexTypes: Hex | Uint8Array) {
  const typeInfoReg = new TypeInfoRegistry(hexTypes);
  return typeInfoReg.getTypes();
}
