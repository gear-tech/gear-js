import { Bool, Bytes, Option, Struct, u32, Text } from '@polkadot/types';
import { HexString } from '../../common';
import { H256 } from '@polkadot/types/interfaces';

export interface PayloadFilter {
  offset: number;
  pattern: HexString | Uint8Array;
}

export interface UserMessageSentSubscriptionFilter {
  source?: HexString;
  destination?: HexString;
  payloadFilters?: PayloadFilter[];
  fromBlock?: number | bigint;
  finalizedOnly?: boolean;
}

export interface UserMessageSentSubscriptionItem {
  readonly id: HexString;
  readonly block: HexString;
  readonly index: number;
  readonly source: HexString;
  readonly destination: HexString;
  readonly payload: HexString;
  readonly value: bigint;
  reply?: UserMessageSentSubscriptionReplyDetails;
}

export interface UserMessageSentSubscriptionReplyDetails {
  readonly to: HexString;
  readonly codeRaw: HexString;
  readonly code: string;
}

export interface UserMessageReplyJson extends Struct {
  readonly to: H256;
  readonly codeRaw: Bytes;
  readonly code: Text;
}

export interface UserMessageSentSubItem extends Struct {
  readonly block: H256;
  readonly index: u32;
  readonly id: H256;
  readonly source: H256;
  readonly destination: H256;
  readonly payload: Bytes;
  readonly value: Text;
  readonly reply?: Option<UserMessageReplyJson>;
  readonly ack: Option<Bool>;
}
