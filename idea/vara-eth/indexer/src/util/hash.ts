import { toPgByteaString } from '@vara-eth/idea-indexer-db';
import xxhash from 'xxhash-addon';

export const createHash = (...args: (string | number | bigint)[]) => {
  const message = Buffer.from(args.join(''));
  return toPgByteaString(xxhash.XXHash3.hash(message));
};
