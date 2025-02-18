import { useState } from 'react';
import SimpleBar from 'simplebar-react';

import { Placeholder } from '@/entities/placeholder';
import EventPlaceholderSVG from '@/shared/assets/images/placeholders/eventPlaceholder.svg?react';

import { FILTER_VALUES, LOCAL_STORAGE } from '../../consts';
import { IdeaEvent } from '../../idea-event';
import { FilterValues } from '../../types';
import { Event } from '../event';
import { Filter } from '../filter';

import styles from './events.module.scss';

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

  const getLastItem = <T,>(array: T[]) => {
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

  return (
    <>
      {isAnyEvent ? (
        <SimpleBar className={styles.simpleBar}>{getEvents()}</SimpleBar>
      ) : (
        <div className={styles.placeholder}>
          <Placeholder
            block={<EventPlaceholderSVG />}
            title="There are no events yet"
            description="The list is empty while there are no events"
            isEmpty={isListEmpty}
            blocksCount={5}
          />
        </div>
      )}

      <Filter values={filterValues} setValues={setFilterValues} isAnySelected={isAnyFilterSelected} />
    </>
  );
};

export { Events };
