import { Hex } from '@gear-js/api';

interface IChainBlock {
  hash: Hex;
  number: number;
  time: string;
}

export type { IChainBlock };
