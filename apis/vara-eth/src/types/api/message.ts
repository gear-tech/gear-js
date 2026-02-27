import { Address, Hash, Hex } from 'viem';

import { ReplyCode } from '../../errors/reply-code.js';

export type MessageId = Hash;

export type DispatchKind = 'Init' | 'Handle' | 'Reply' | 'Signal';

export type PayloadLookup = { Direct: Hex } | { Stored: Hash };

export interface ReplyDetails {
  readonly to: MessageId;
  readonly code: ReplyCode;
}

export interface SignalDetails extends Pick<ReplyDetails, 'to'> {
  readonly code: unknown; // TODO: figure out the type here
}

export type MessageDetails = { Reply: ReplyDetails } | { Signal: SignalDetails };

export interface ContextStore {
  readonly initialized: Array<Address>;
  readonly reservationNonce: number;
  readonly systemReservation: number;
  readonly localNonce: number;
}

export type MessageType = 'Canonical' | 'Injected';

export interface Dispatch {
  /// Message id.
  readonly id: MessageId;
  /// Dispatch kind.
  readonly kind: DispatchKind;
  /// Message source.
  readonly source: Address;
  /// Message payload.
  readonly payload: PayloadLookup;
  /// Message value.
  readonly value: bigint;
  /// Message details like reply message ID, status code, etc.
  readonly details: MessageDetails | null;
  /// Message previous executions context.
  readonly context: ContextStore | null;
  /// Type of the message.
  readonly message_type: MessageType;
  /// If to call on eth.
  readonly call: boolean;
}
