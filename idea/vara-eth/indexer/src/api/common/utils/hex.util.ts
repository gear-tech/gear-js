import { fromPgBytea, toPgBytea, toPgByteaString } from '../../../util/db.js';

export const toBytea = toPgByteaString;
export const toByteaBuffer = toPgBytea;
export const toHexString = fromPgBytea;
export const bigIntToString = (value: bigint): string => value.toString();
