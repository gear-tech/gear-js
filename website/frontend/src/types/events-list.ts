import { GearEvent } from '@gear-js/api';
import { Event as DotEvent } from '@polkadot/types/interfaces';
import { AnyJson } from '@polkadot/types/types';
import { generateRandomId } from 'helpers';

export class Event extends GearEvent {
  constructor(event: DotEvent) {
    super(event);
    this._id = `${event.hash}-${generateRandomId()}`;
  }

  private _id: string;

  get id() {
    return this._id;
  }
}

export type Events = Event[];

export type EventsProps = {
  events: Events;
};

export type FilterValues = { [filter: string]: boolean };

export enum Sections {
  SYSTEM = 'system',
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
  caption: string;
  description: AnyJson;
};

export type GroupedEvents = EventGroup[];
