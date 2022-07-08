import { u8, u64, u128, Type, Null, Option, Vec, Tuple, BTreeMap } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { H256 } from '@polkadot/types/interfaces';
import { MessageId } from '../ids';
import { Hex, ExitCode } from '../common';

export declare interface Reply extends Tuple {
  0: H256;
  1: ExitCode;
}

export type Payload = Vec<u8>;

export declare interface Message extends Codec {
  id: H256;
  source: H256;
  destination: H256;
  payload: Vec<u8>;
  gas_limit: u64;
  value: u128;
  reply: Option<Reply>;
}

export type QueuedMessage = Omit<Message, 'gas_limit'>;

export declare interface DispatchKind extends Type {
  isInit: boolean;
  asInit: Null;
  isHandle: boolean;
  asHandle: Null;
  isHandleReply: boolean;
  asHandleReply: Null;
}

export declare interface PayloadStore extends Codec {
  outgoing: BTreeMap<u64, Option<Payload>>;
  new_programs: Vec<Codec>;
  reply: Option<Payload>;
  awaken: Vec<Codec>;
  reply_was_sent: boolean;
}

export declare interface QueuedDispatch extends Codec {
  kind: DispatchKind;
  message: QueuedMessage;
  payload_store: Option<PayloadStore>;
}

export type StoredMessage = Omit<Message, 'gas_limit'>;

export interface HumanedMessage {
  id: MessageId;
  source: Hex;
  destination: Hex;
  payload: Hex | string;
  value: string;
  reply: [Hex, number] | null;
}
