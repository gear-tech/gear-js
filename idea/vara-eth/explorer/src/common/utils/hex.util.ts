import { type Hex, isHex } from 'viem';

// TODO: consider moving these functions to a separate `common` package

function toPgByteaString(value: string | Buffer): string {
  if (Buffer.isBuffer(value)) {
    return `\\x${value.toString('hex')}`;
  }

  if (isHex(value)) {
    const cleaned = value.startsWith('0x') ? value.slice(2) : value;
    return `\\x${cleaned}`;
  }

  throw new Error('Invalid hex string');
}

function toPgBytea(value: string | Buffer): Buffer {
  if (Buffer.isBuffer(value)) {
    return value;
  }

  if (isHex(value) || isHex(`0x${value}`)) {
    const cleaned = value.startsWith('0x') ? value.slice(2) : value;
    return Buffer.from(cleaned, 'hex');
  }

  throw new Error('Invalid hex string');
}

function fromPgBytea(value: string | Buffer): Hex {
  if (Buffer.isBuffer(value)) {
    return `0x${value.toString('hex')}` as Hex;
  }

  return `0x${value.slice(2)}`;
}

export const toBytea = toPgByteaString;
export const toByteaBuffer = toPgBytea;
export const toHexString = fromPgBytea;
export const bigIntToString = (value: bigint): string => value.toString();
