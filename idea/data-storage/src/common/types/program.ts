import { HexString } from '@polkadot/util/types';
import { ProgramStatus } from '@gear-js/common';
import { MessageQueuedData } from '@gear-js/api';

import { BaseDataInput } from './gear';

export interface ProgramChangedInput extends BaseDataInput {
  id: HexString;
  programStatus: ProgramStatus;
}

export interface CreateProgramByExtrinsicInput {
  genesis: string;
  timestamp: number;
  blockHash: any;
  eventData: MessageQueuedData;
}
