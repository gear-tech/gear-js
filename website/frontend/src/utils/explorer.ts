import { Vec } from '@polkadot/types';
import { EventRecord } from '@polkadot/types/interfaces';
import { Event, GroupedEvents, Sections } from 'types/explorer';

const getCaption = ({ method, section }: Event) => `${section}.${method}`;

export const getEvents = (eventRecords: Vec<EventRecord>, blockNumber: string) =>
  // reduce right to keep newer -> older order
  eventRecords.reduceRight((events: Event[], eventRecord) => {
    const { event: dotEvent } = eventRecord;
    const { section } = dotEvent;

    if (section !== Sections.SYSTEM) {
      const event = new Event(dotEvent, blockNumber);
      events.push(event);
    }

    return events;
  }, []);

export const getGroupedEvents = (events: Event[]) =>
  events.reduce((groupedEvents: GroupedEvents, event, index) => {
    const prevEvent = events[index - 1];
    const prevCaption = prevEvent ? getCaption(prevEvent) : undefined;
    const caption = getCaption(event);

    if (prevCaption !== caption) {
      const { method, meta, id, blockNumber } = event;
      const { docs } = meta;

      const description = docs.toHuman();

      // for eventGroup it's important to maintain exclusive ID (as well as for event itself),
      // so group ID is the ID of first (oldest) event, event that's remaining the same
      const eventGroup = { id, method, caption, description, blockNumber, list: [] };
      groupedEvents.push(eventGroup);
    }

    const lastIndex = groupedEvents.length - 1;
    const lastGroup = groupedEvents[lastIndex];
    lastGroup.list.push(event);

    return groupedEvents;
  }, []);
