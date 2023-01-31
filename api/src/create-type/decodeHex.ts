import { HexString } from '@polkadot/util/types';

import { TypeInfoRegistry } from './TypeInfoReg';

export function decodeHexTypes(hexTypes: HexString | Uint8Array) {
  const typeInfoReg = new TypeInfoRegistry(hexTypes);
  return typeInfoReg.getTypes();
}
