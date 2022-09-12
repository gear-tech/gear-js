import { ExtrinsicStatus, SignedBlock } from '@polkadot/types/interfaces';
import { MessageEnqueuedData } from '@gear-js/api';

interface HandleExtrinsicsData {
  signedBlock: SignedBlock;
  events: any;
  status: ExtrinsicStatus;
  genesis: string;
  timestamp: number;
  blockHash: any;
}

interface CreateProgramByExtrinsicMethod {
  genesis: string;
  timestamp: number;
  blockHash: any;
  eventData: MessageEnqueuedData
}

export { HandleExtrinsicsData, CreateProgramByExtrinsicMethod };
