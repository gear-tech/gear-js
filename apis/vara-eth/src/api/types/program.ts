import type { Hash } from 'viem';

import type { ProgramBestStateRpc } from '../../types/api/internal.js';
import { Message } from './message.js';

export class ProgramBestState {
  readonly mbHash: Hash;
  readonly newStateHash: Hash;
  readonly messages: Message[];

  constructor(value: ProgramBestStateRpc) {
    this.mbHash = value.mbHash;
    this.newStateHash = value.newStateHash;
    this.messages = value.messages.map((m) => new Message(m));
  }
}
