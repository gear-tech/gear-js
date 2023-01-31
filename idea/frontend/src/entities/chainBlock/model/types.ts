import { HexString } from '@polkadot/util/types';

interface IChainBlock {
  hash: HexString;
  number: number;
  time: string;
}

export type { IChainBlock };
