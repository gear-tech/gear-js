import { toPgBytea, toPgByteaString, fromPgBytea } from '../../../util/db.js';

export const toBytea = toPgByteaString;
export const toByteaBuffer = toPgBytea;
export const toHexString = fromPgBytea;
export const bigIntToString = (value: bigint): string => value.toString();
