import { Hex } from '@gear-js/api';

export type Block = {
  hash: Hex;
  number: number;
  time: string;
};

export type Blocks = Block[];
