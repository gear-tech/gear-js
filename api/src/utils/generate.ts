import { blake2AsHex, blake2AsU8a } from '@polkadot/util-crypto';
import { u8aToU8a } from '@polkadot/util';

import { Hex } from '../types';
import { CreateType } from '../create-type/CreateType';

export function generateCodeId(code: Buffer | Uint8Array): Hex {
  return blake2AsHex(code, 256);
}

export function generateProgramId(codeId: Hex | Uint8Array, salt: string | Hex | Uint8Array): Hex;

export function generateProgramId(code: Buffer | Uint8Array, salt: string | Hex | Uint8Array): Hex;

export function generateProgramId(codeOrHash: Buffer | Uint8Array | Hex, salt: string | Hex | Uint8Array): Hex {
  const [code, codeHash] = typeof codeOrHash === 'string' ? [undefined, codeOrHash] : [codeOrHash, undefined];
  const codeHashU8a = codeHash ? u8aToU8a(codeHash) : blake2AsU8a(code, 256);
  const saltU8a = CreateType.create('Vec<u8>', salt).toU8a().slice(1);
  const id = new Uint8Array(codeHashU8a.byteLength + saltU8a.byteLength);
  id.set(codeHashU8a);
  id.set(saltU8a, codeHashU8a.byteLength);
  return blake2AsHex(id, 256);
}
