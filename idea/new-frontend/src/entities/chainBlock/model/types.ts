import { Hex } from '@gear-js/api';

type ChainBlock = {
  hash: Hex;
  number: number;
  time: string;
};

export type { ChainBlock };
