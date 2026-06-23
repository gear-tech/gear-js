import type { Hex } from 'gear-idea-indexer-db';

import { Events, type MessageStatus } from '../../common/index.js';
import type { Event } from '../../processor.js';
import type { IReplyCode } from './reply-code.js';

export interface AMessageQueued {
  id: Hex;
  source: Hex;
  destination: Hex;
  entry: {
    __kind: string;
  };
}

export type EMessageQueuedEvent = {
  args: AMessageQueued;
} & Omit<Event, 'args'>;

export const isMessageQueued = (event: Event): event is EMessageQueuedEvent => event.name === Events.MessageQueued;

export interface AUserMessageSent {
  message: {
    id: Hex;
    source: Hex;
    destination: Hex;
    payload: Hex;
    value: string;
    details?: {
      to: Hex;
      code: IReplyCode;
    };
  };
  expiration?: number;
}

export type EUserMessageSent = { args: AUserMessageSent } & Omit<Event, 'args'>;

export const isUserMessageSent = (event: Event): event is EUserMessageSent => event.name === Events.UserMessageSent;

export interface AMessagesDispatched {
  total: number;
  statuses: [Hex, { __kind: MessageStatus }][];
  stateChanges: Hex[];
}

export type EMessagesDispatched = { args: AMessagesDispatched } & Omit<Event, 'args'>;

export const isMessagesDispatched = (event: Event): event is EMessagesDispatched =>
  event.name === Events.MessagesDispatched;

export interface AUserMEssageRead {
  id: Hex;
  reason: {
    __kind: 'System' | 'Runtime';
    value: { __kind: 'OutOfRent' | 'MessageClaimed' | 'MessageReplied' };
  };
}

export type EUserMessageRead = { args: AUserMEssageRead } & Omit<Event, 'args'>;

export const isUserMessageRead = (event: Event): event is EUserMessageRead => event.name === Events.UserMessageRead;
