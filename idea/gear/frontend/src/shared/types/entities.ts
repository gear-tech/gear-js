import { HexString } from '@polkadot/util/types';

interface IBase {
  genesis: string; // TODO: remove after migration to new indexer
  timestamp: string;
  blockHash: HexString;
  blockNumber: string;
}

export type { IBase };
