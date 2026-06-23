import type { Address, Hash, Hex } from 'viem';

import type { ReplyDetails } from './message.js';

export type MessageRpc = {
  readonly id: Hash;
  readonly destination: Address;
  readonly replyDetails: ReplyDetails | null;
  readonly call: boolean;
  readonly payload: Hex | Array<number>;
  readonly value: string | number;
};
export type ProgramBestStateRpc = {
  readonly mbHash: Hash;
  readonly newStateHash: Hash;
  readonly messages: Array<MessageRpc>;
};
