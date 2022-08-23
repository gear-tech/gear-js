import { Hex } from '@gear-js/api';

export type ChainBlock = {
  hash: Hex;
  number: number;
  time: string;
};
