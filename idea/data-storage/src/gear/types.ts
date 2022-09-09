import { ExtrinsicStatus, SignedBlock } from '@polkadot/types/interfaces';

interface HandleExtrinsicsData {
  signedBlock: SignedBlock;
  events: any;
  status: ExtrinsicStatus;
  genesis: string;
  timestamp: number;
}

export { HandleExtrinsicsData };
