import { HexString } from '@gear-js/api';

type RecentBlock = {
  hash: HexString;
  number: number;
  time: string;
};

export type { RecentBlock };
