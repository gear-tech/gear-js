import { HexString, generateCodeHash } from '@gear-js/api';
import { InvalidMetadataError } from './errors';

export function validateMetaHex(hex: HexString, hash: string) {
  if (hash !== generateCodeHash(hex)) {
    throw new InvalidMetadataError();
  }
}
