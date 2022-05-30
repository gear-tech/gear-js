import { MessageId, ProgramId } from './ids';
import { HumanedMessage } from './interfaces';

export type WaitlistType = [
  [ProgramId, MessageId],
  { kind: 'Handle' | 'Init' | 'Reply'; message: HumanedMessage; context: any },
][];
