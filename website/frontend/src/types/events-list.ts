import { Event } from '@polkadot/types/interfaces';

export type FilterValues = { [key: string]: boolean };

export interface EventsState {
  list: Event[];
}

export enum EventsActionTypes {
  ADD_EVENTS = 'ADD_EVENTS',
}

export interface AddEventsAction {
  type: EventsActionTypes.ADD_EVENTS;
  payload: Event[];
}

export type EventsAction = AddEventsAction;
