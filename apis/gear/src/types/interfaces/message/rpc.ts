import { Bool, Bytes, Option, Struct, u32, Text } from '@polkadot/types';
import { hexToU8a, isHex, isU8a } from '@polkadot/util';
import { H256 } from '@polkadot/types/interfaces';

import { HexString } from '../../common';

export class PayloadFilter {
  public readonly pattern: Uint8Array;

  constructor(
    pattern: HexString | Uint8Array,
    public readonly offset = 0,
  ) {
    if (isHex(pattern)) {
      this.pattern = hexToU8a(pattern);
    } else if (isU8a(pattern)) {
      this.pattern = pattern;
    } else {
      throw new Error('Invalid pattern format');
    }
  }

  toJSON() {
    return {
      pattern: Array.from(this.pattern),
      offset: this.offset,
    };
  }
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
