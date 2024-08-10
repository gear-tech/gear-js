import { HexString, generateCodeHash } from '@gear-js/api';
import { InvalidMetadataError } from '@gear-js/common';

export function validateMetaHex(hex: HexString, hash: string) {
  console.log(hex, hash, generateCodeHash(hex));
  if (hash !== generateCodeHash(hex)) {
    throw new InvalidMetadataError();
  }
}
