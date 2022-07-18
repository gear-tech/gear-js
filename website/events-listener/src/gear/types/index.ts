import { UpdateMessagesParams } from '@gear-js/common';
import { ExtrinsicStatus, SignedBlock } from '@polkadot/types/interfaces';

interface UpdateBlockExtrinsics {
  signedBlock: SignedBlock;
  events: any;
  status: ExtrinsicStatus;
  genesis: string;
}

type ExtrinsicsResult = UpdateMessagesParams;

export { ExtrinsicsResult, UpdateBlockExtrinsics };
