import type { Hex, PgByteaString } from './types.js';

export const hexToBytea = {
  to: (v: string | Hex | PgByteaString | null | undefined): Buffer | null => {
    if (!v) return null;
    const unprefixed = v.startsWith('0x') || v.startsWith('\\x') ? v.slice(2) : v;
    if (unprefixed.length % 2 !== 0) throw new Error(`Invalid hex string: ${v}`);
    return Buffer.from(unprefixed, 'hex');
  },
  from: (v: Buffer | null | undefined): Hex | null => {
    if (!v) return null;
    return `0x${v.toString('hex')}`;
  },
};

export const toPgByteaString = (value: Hex): PgByteaString => `\\x${value.slice(2)}`;

export const fromPgByteaString = (value: PgByteaString): Hex => `0x${value.slice(2)}`;
