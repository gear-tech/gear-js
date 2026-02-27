import { blake2b } from '@noble/hashes/blake2.js';
import { bytesToHex, hexToBytes } from 'viem';

const CODE_HASH_LEN = 32;

export const generateCodeHash = (code: Uint8Array | `0x${string}`): `0x${string}` => {
  const codeU8a = typeof code === 'string' ? hexToBytes(code) : code;
  return bytesToHex(blake2b(codeU8a, { dkLen: CODE_HASH_LEN }));
};
