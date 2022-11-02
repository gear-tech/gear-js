import { UserMessageSentInput } from '../../message/types/user-message-sent.input';
import { UserMessageReadInput } from '../../message/types/user-message-read.input';
import { ProgramChangedInput } from '../../program/types/program-changed.input';
import { MessageDispatchedDataInput } from '../../message/types/message-dispatched-data.input';

export type GearEventPayload =
  UserMessageSentInput |
  UserMessageReadInput |
  ProgramChangedInput |
  MessageDispatchedDataInput  |
  null
