import { Event } from '@polkadot/types/interfaces';

export type FilterValues = { [filter: string]: boolean };

export enum Sections {
  SYSTEM = 'SYSTEM',
}

export enum Methods {
  TRANSFER = 'Transfer',
  LOG = 'Log',
  INIT_SUCCESS = 'InitSuccess',
  INIT_FAILURE = 'InitFailure',
  DISPATCH_MESSAGE_ENQUEUED = 'DispatchMessageEnqueued',
  MESSAGE_DISPATCHED = 'MessageDispatched',
}

export type TypeKey = 'handle_output' | 'init_output';

export type EventGroup = {
  list: Event[];
  id: string;
  method: string;
};

export type GroupedEvents = EventGroup[];

export type GroupedEventsProps = {
  groupedEvents: GroupedEvents;
};
