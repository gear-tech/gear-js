import { blake2bHex } from 'blakejs';

import { hexToUint8Array } from './hex.js';
import { HexString } from './types/index.js';

const CODE_HASH_LEN = 32;

export const generateCodeHash = (code: Uint8Array | HexString): HexString =>
  `0x${blake2bHex(typeof code == 'string' ? hexToUint8Array(code) : code, undefined, CODE_HASH_LEN)}`;
