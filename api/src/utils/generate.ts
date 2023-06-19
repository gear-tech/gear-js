import { blake2AsHex, blake2AsU8a } from '@polkadot/util-crypto';
import { HexString } from '@polkadot/util/types';
import { TypeRegistry } from '@polkadot/types';
import { u8aToU8a } from '@polkadot/util';

import { CreateType } from '../metadata';

export function generateCodeHash(code: Buffer | Uint8Array | HexString): HexString {
  return blake2AsHex(u8aToU8a(code), 256);
}

export function generateProgramId(codeId: HexString | Uint8Array, salt: string | HexString | Uint8Array): HexString;

export function generateProgramId(code: Buffer | Uint8Array, salt: string | HexString | Uint8Array): HexString;

export function generateProgramId(
  codeOrHash: Buffer | Uint8Array | HexString,
  salt: string | HexString | Uint8Array,
): HexString {
  const [code, codeHash] = typeof codeOrHash === 'string' ? [undefined, codeOrHash] : [codeOrHash, undefined];
  const codeHashU8a = codeHash ? u8aToU8a(codeHash) : blake2AsU8a(code, 256);
  const saltU8a = CreateType.create('Vec<u8>', salt).toU8a().slice(1);
  const programStrU8a = new TextEncoder().encode('program');
  const id = Uint8Array.from([...programStrU8a, ...codeHashU8a, ...saltU8a]);
  return blake2AsHex(id, 256);
}
