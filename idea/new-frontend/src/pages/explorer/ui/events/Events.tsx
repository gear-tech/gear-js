import { useState } from 'react';
import SimpleBar from 'simplebar-react';
import clsx from 'clsx';

import { IdeaEvent } from 'entities/explorer';
import { LOCAL_STORAGE, FilterValues, FILTER_VALUES } from 'pages/explorer/model';

import { Filter } from '../filter';
import { Event } from '../event';
import { EventsPlaceholder } from '../eventsPlaceholder';

import styles from './Events.module.scss';

type Props = {
  events: IdeaEvent[] | undefined;
};

const Events = ({ events }: Props) => {
  const localFilterValues = localStorage.getItem(LOCAL_STORAGE.EVENT_FILTERS);

  const [filterValues, setFilterValues] = useState<FilterValues>(
    localFilterValues ? JSON.parse(localFilterValues) : FILTER_VALUES,
  );

  const isAnyFilterSelected = Object.values(filterValues).includes(true);

  const filteredEvents = isAnyFilterSelected ? events?.filter(({ method }) => filterValues[method]) : events;

  // maybe worth to retrive element's type? to set return type and get rid of any
  const getLastItem = (array: any[]) => {
    const lastIndex = array.length - 1;
    return array[lastIndex];
  };

  const getGroupedEvents = () =>
    filteredEvents?.reduce((groupedEvents: IdeaEvent[][], event, index) => {
      const prevEvent = filteredEvents[index - 1];

      const { heading, blockNumber } = event;
      const { heading: prevHeading, blockNumber: prevBlockNumber } = prevEvent || {};
      const isNewGroup = prevHeading !== heading || prevBlockNumber !== blockNumber;

      if (isNewGroup) {
        groupedEvents.push([]);
      }

      getLastItem(groupedEvents).push(event);

      return groupedEvents;
    }, []);

  // it's important to maintain exclusive ID,
  // so group ID is the ID of the oldest event in this group, event that's remaining the same
  const getEvents = () => getGroupedEvents()?.map((group) => <Event key={getLastItem(group).id} value={group} />);

  const isAnyEvent = filteredEvents && filteredEvents.length > 0;
  const isListEmpty = filteredEvents?.length === 0;
  const isPlaceholderVisible = !isAnyEvent;

  const simpleBarClassName = clsx(styles.simpleBar, isPlaceholderVisible && styles.noOverflow);

  return (
    <>
      <SimpleBar className={simpleBarClassName}>
        {isAnyEvent ? getEvents() : <EventsPlaceholder isEmpty={isListEmpty} />}
      </SimpleBar>
      <Filter values={filterValues} setValues={setFilterValues} isAnySelected={isAnyFilterSelected} />
    </>
  );
};

export { Events };
