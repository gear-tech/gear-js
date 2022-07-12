import { u8, u64, u128, i32, Option, Vec, Tuple } from '@polkadot/types';
import { H256, AccountId32 } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

import { MessageId, ProgramId } from '../ids';

export type ExitCode = i32;

export type Payload = Vec<u8>;

export interface Reply extends Tuple {
  0: H256;
  1: ExitCode;
}

export interface Message extends Codec {
  id: MessageId;
  source: ProgramId;
  destination: AccountId32;
  payload: Vec<u8>;
  gas_limit: u64;
  value: u128;
  reply: Option<Reply>;
}

export type UserMessageSentMessage = Omit<Message, 'gas_limit'>;

export type StoredMessage = Omit<Message, 'gas_limit'>;
