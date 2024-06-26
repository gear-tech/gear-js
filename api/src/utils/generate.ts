import { HexString, U8aLike } from '@polkadot/util/types';
import { blake2AsHex, blake2AsU8a } from '@polkadot/util-crypto';
import { stringToU8a, u8aToU8a } from '@polkadot/util';

import { CreateType } from '../metadata';
import { GearApi } from 'GearApi';

const VOUCHER_PREFIX_BEFORE_1100 = stringToU8a('modlpy/voucher__');
const VOUCHER_PREFIX = stringToU8a('voucher');

export function generateCodeHash(code: Buffer | Uint8Array | HexString): HexString {
  return blake2AsHex(u8aToU8a(code), 256);
}

export function generateProgramId(
  api: GearApi,
  codeId: HexString | Uint8Array,
  salt: string | HexString | Uint8Array,
): HexString;

export function generateProgramId(
  api: GearApi,
  code: Buffer | Uint8Array,
  salt: string | HexString | Uint8Array,
): HexString;

export function generateProgramId(
  api: GearApi,
  codeOrHash: Buffer | Uint8Array | HexString,
  salt: string | HexString | Uint8Array,
): HexString {
  const [code, codeHash] = typeof codeOrHash === 'string' ? [undefined, codeOrHash] : [codeOrHash, undefined];
  const codeHashU8a = codeHash ? u8aToU8a(codeHash) : blake2AsU8a(code, 256);
  const saltU8a = CreateType.create('Vec<u8>', salt).toU8a().slice(1);
  const prefix = 'program_from_user';
  const programStrU8a = new TextEncoder().encode(prefix);
  const id = Uint8Array.from([...programStrU8a, ...codeHashU8a, ...saltU8a]);
  return blake2AsHex(id, 256);
}

/**
 * @deprecated
 */
export function generateVoucherId(who: HexString, programId: HexString): HexString;
export function generateVoucherId(nonce: U8aLike): HexString;
export function generateVoucherId(nonceOrWho: U8aLike | HexString, programId?: HexString): HexString {
  const [nonce, who] = typeof nonceOrWho === 'string' && programId ? [undefined, nonceOrWho] : [nonceOrWho, undefined];
  if (nonce) {
    const nonceU8a = u8aToU8a(nonce);
    const id = Uint8Array.from([...VOUCHER_PREFIX, ...nonceU8a]);
    return blake2AsHex(id, 256);
  }
  const whoU8a = u8aToU8a(who);
  const programU8a = u8aToU8a(programId);
  const id = Uint8Array.from([...VOUCHER_PREFIX_BEFORE_1100, ...whoU8a, ...programU8a]);
  return blake2AsHex(id, 256);
}
