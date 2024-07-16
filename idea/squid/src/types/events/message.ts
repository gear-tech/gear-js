import { Events, MessageStatus } from '../../common';
import { MessageEntryPoint } from '../../model';
import { Event } from '../../processor';

export interface IMessageQueuedArgs {
  id: string;
  source: string;
  destination: string;
  entry: MessageEntryPoint;
}

export type EMessageQueuedEvent = {
  args: IMessageQueuedArgs;
} & Omit<Event, 'args'>;

export const isMessageQueued = (event: Event): event is EMessageQueuedEvent => event.name === Events.MessageQueued;

export interface AUserMessageSent {
  message: {
    id: string;
    source: string;
    destination: string;
    payload: string;
    value: string;
    details?: {
      to: string;
      code: {
        __kind: 'Success' | 'Error';
        value: any;
      };
    };
  };
  expirtaion?: number;
}

export type EUserMessageSent = { args: AUserMessageSent } & Omit<Event, 'args'>;

export const isUserMessageSent = (event: Event): event is EUserMessageSent => event.name === Events.UserMessageSent;

export interface AMessagesDispatched {
  total: number;
  statuses: [string, { __kind: MessageStatus }][];
  stateChanges: string[];
}

export type EMessagesDispatched = { args: AMessagesDispatched } & Omit<Event, 'args'>;

export const isMessagesDispatched = (event: Event): event is EMessagesDispatched =>
  event.name === Events.MessagesDispatched;

export interface AUserMEssageRead {
  id: string;
  reason: {
    __kind: 'System' | 'Runtime';
    value: { __kind: 'OutOfRent' | 'MessageClaimed' | 'MessageReplied' };
  };
}

export type EUserMessageRead = { args: AUserMEssageRead } & Omit<Event, 'args'>;

export const isUserMessageRead = (event: Event): event is EUserMessageRead => event.name === Events.UserMessageRead;
