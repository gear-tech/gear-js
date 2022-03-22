import { u8, u64, u128, Type, Null, Option, Vec, Tuple, Map, BTreeMap } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { H256 } from '@polkadot/types/interfaces';
import { ExitCode } from '.';

export declare interface Reply extends Tuple {
  0: H256;
  1: ExitCode;
}

export declare interface Payload extends Vec<u8> {}

export declare interface Message extends Codec {
  id: H256;
  source: H256;
  dest: H256;
  payload: Vec<u8>;
  gas_limit: u64;
  value: u128;
  reply: Option<Reply>;
}

export declare interface QueuedMessage extends Omit<Message, 'gas_limit'> {}

export declare interface DispatchKind extends Type {
  isInit: Boolean;
  asInit: Null;
  isHandle: Boolean;
  asHandle: Null;
  isHandleReply: Boolean;
  asHandleReply: Null;
}

export declare interface PayloadStore extends Codec {
  outgoing: BTreeMap<u64, Option<Payload>>;
  new_programs: Vec<Codec>;
  reply: Option<Payload>;
  awaken: Vec<Codec>;
  reply_was_sent: Boolean;
}

export declare interface QueuedDispatch extends Codec {
  kind: DispatchKind;
  message: QueuedMessage;
  payload_store: Option<PayloadStore>;
}
