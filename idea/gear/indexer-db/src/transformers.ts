import type { Hex, PgByteaString } from './types.js';

export const hexToBytea = {
  to: (v: string | Hex | PgByteaString | null | undefined): Buffer | null => {
    if (!v) return null;
    const unprefixed = v.startsWith('0x') || v.startsWith('\\x') ? v.slice(2) : v;
    return Buffer.from(unprefixed, 'hex');
  },
  from: (v: Buffer | null | undefined): PgByteaString | null => {
    if (!v) return null;
    return `\\x${v.toString('hex')}`;
  },
};

const _codeStatusToString: Record<number, string> = { 0: 'Active', 1: 'Inactive', 2: 'Unknown' };
const _codeStatusFromString: Record<string, number> = { Active: 0, Inactive: 1, Unknown: 2 };

export const codeStatusTransformer = {
  to: (v: string | number | null | undefined): number | null => {
    if (v == null) return null;
    if (typeof v === 'number') return v;
    return _codeStatusFromString[v] ?? null;
  },
  from: (v: number | string | null | undefined): string | null => {
    if (v == null) return null;
    const n = typeof v === 'string' ? parseInt(v, 10) : v;
    return _codeStatusToString[n] ?? null;
  },
};

export const toPgByteaString = (value: Hex): PgByteaString => `\\x${value.slice(2)}`;

export const fromPgByteaString = (value: PgByteaString): Hex => `0x${value.slice(2)}`;
