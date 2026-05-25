import type { PgByteaString } from '@vara-eth/idea-indexer-db';
import { Transform } from 'class-transformer';

export const toBytea = (hex: string): PgByteaString => `\\x${hex.replace(/^0x/i, '').toLowerCase()}` as PgByteaString;

export const toHexString = (value: Buffer | string): string => {
  if (Buffer.isBuffer(value)) return `0x${value.toString('hex')}`;
  if (typeof value === 'string' && value.startsWith('\\x')) return `0x${value.slice(2)}`;
  return value;
};

export const bigIntToString = (value: bigint): string => value.toString();

export const TransformToBytea = () => Transform(({ value }) => (value != null ? toBytea(value as string) : value));
