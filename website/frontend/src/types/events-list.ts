import { Event } from '@polkadot/types/interfaces';

export type FilterValues = { [key: string]: boolean };

export type EventGroup = {
  list: Event[];
  id: string;
  method: string;
};

export type GroupedEvents = EventGroup[];

export type GroupedEventsProps = {
  groupedEvents: GroupedEvents;
};
