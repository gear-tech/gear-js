import { HexString } from '@polkadot/util/types';

interface IBase {
  genesis: string;
  timestamp: string;
  blockHash: HexString;
}

export type { IBase };
