import { Event } from '@polkadot/types/interfaces';
import { generateRandomId } from 'helpers';
import { GroupedEvents } from 'types/events-list';

export const getCaption = ({ method, section }: Event) => `${section}.${method}`;

export const getGroupedEvents = (eventsAccumulator: GroupedEvents, event: Event, index: number, events: Event[]) => {
  const prevEvent = events[index - 1];
  const prevCaption = prevEvent ? getCaption(prevEvent) : undefined;
  const caption = getCaption(event);

  if (prevCaption !== caption) {
    const { method, hash } = event;
    const id = `${hash}-${generateRandomId()}`;

    const eventGroup = { id, list: [], method };
    eventsAccumulator.push(eventGroup);
  }

  const lastIndex = eventsAccumulator.length - 1;
  const lastGroup = eventsAccumulator[lastIndex];
  lastGroup.list.push(event);

  return eventsAccumulator;
};
