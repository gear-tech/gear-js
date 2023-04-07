import { HexString } from '@polkadot/util/types';

import { CodeChangedInput } from './code';
import { MessagesDispatchedDataInput, UserMessageReadInput, UserMessageSentInput } from './message';
import { ProgramChangedInput } from './program';

export interface BaseDataInput {
  genesis?: string;
  timestamp?: number;
  blockHash?: any;
}

export type GearEventPayload =
  | UserMessageSentInput
  | UserMessageReadInput
  | ProgramChangedInput
  | MessagesDispatchedDataInput
  | CodeChangedInput
  | null;

export interface BlockParams {
  blockNumber: number;
  hash: HexString;
}
