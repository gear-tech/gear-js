import { ExtrinsicStatus, SignedBlock } from '@polkadot/types/interfaces';

export interface HandleExtrinsicsDataInput {
  signedBlock: SignedBlock;
  events: any;
  status: ExtrinsicStatus;
  genesis: string;
  timestamp: number;
  blockHash: any;
}
