import { type Address, bytesToHex, type Hash, type Hex } from 'viem';
import type { MessageRpc } from '../../types/api/internal.js';
import type { ReplyDetails } from '../../types/api/message.js';

export class Message {
  readonly id: Hash;
  readonly destination: Address;
  readonly payload: Hex;
  readonly value: bigint;
  readonly replyDetails: ReplyDetails | null;
  readonly call: boolean;

  constructor(value: MessageRpc) {
    this.id = value.id;
    this.destination = value.destination;
    this.replyDetails = value.replyDetails;
    this.call = value.call;
    this.value = BigInt(value.value);
    this.payload = Array.isArray(value.payload) ? bytesToHex(Uint8Array.from(value.payload)) : value.payload;
  }
}
