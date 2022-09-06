import { ExtrinsicStatus, SignedBlock } from '@polkadot/types/interfaces';

interface HandleExtrinsicsData {
  signedBlock: SignedBlock;
  events: any;
  status: ExtrinsicStatus;
  genesis: string;
}

export { HandleExtrinsicsData };
