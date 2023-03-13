import { ExtrinsicStatus, SignedBlock } from '@polkadot/types/interfaces';

import { CodeChangedInput } from './code';
import { MessagesDispatchedDataInput, UserMessageReadInput, UserMessageSentInput } from './message';
import { ProgramChangedInput } from './program';

export interface BaseDataInput {
  genesis?: string;
  timestamp?: number;
  blockHash?: any;
}

export interface HandleExtrinsicsDataInput {
  signedBlock: SignedBlock;
  events: any;
  status: ExtrinsicStatus;
  genesis: string;
  timestamp: number;
  blockHash: any;
}

export type GearEventPayload =
  | UserMessageSentInput
  | UserMessageReadInput
  | ProgramChangedInput
  | MessagesDispatchedDataInput
  | CodeChangedInput
  | null;
