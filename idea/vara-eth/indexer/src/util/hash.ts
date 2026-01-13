import xxhash from 'xxhash-addon';

import { toPgByteaString } from './db.js';

export const createHash = (...args: (string | number | bigint)[]): string => {
  const message = Buffer.from(args.join(''));
  return toPgByteaString(xxhash.XXHash3.hash(message));
};
