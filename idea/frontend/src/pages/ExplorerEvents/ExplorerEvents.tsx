import { useState } from 'react';

import styles from './ExplorerEvents.module.scss';
import { FILTER_VALUES } from './const';
import { Filters } from './children/Filters/Filters';

import { LOCAL_STORAGE } from 'consts';
import { FilterValues, IdeaEventsProps, GroupedEvents } from 'types/explorer';
import { Event } from 'components/common/Event/Event';

const ExplorerEvents = ({ events }: IdeaEventsProps) => {
  const localFilterValues = localStorage.getItem(LOCAL_STORAGE.EVENT_FILTERS);

  const [filterValues, setFilterValues] = useState<FilterValues>(
    localFilterValues ? JSON.parse(localFilterValues) : FILTER_VALUES
  );

  const isAnyFilterSelected = Object.values(filterValues).includes(true);

  const filteredEvents = isAnyFilterSelected ? events.filter(({ method }) => filterValues[method]) : events;

  // maybe worth to retrive element's type? to set return type and get rid of any
  const getLastItem = (array: any[]) => {
    const lastIndex = array.length - 1;
    return array[lastIndex];
  };

  const getGroupedEvents = () =>
    filteredEvents.reduce((groupedEvents: GroupedEvents, event, index) => {
      const prevEvent = filteredEvents[index - 1];

      const { caption, blockNumber } = event;
      const { caption: prevCaption, blockNumber: prevBlockNumber } = prevEvent || {};
      const isNewGroup = prevCaption !== caption || prevBlockNumber !== blockNumber;

      if (isNewGroup) {
        groupedEvents.push([]);
      }

      getLastItem(groupedEvents).push(event);

      return groupedEvents;
    }, []);

  // it's important to maintain exclusive ID,
  // so group ID is the ID of the oldest event in this group, event that's remaining the same
  const getEvents = () => getGroupedEvents().map((group) => <Event key={getLastItem(group).id} value={group} />);

  const eventsAmount = filteredEvents.length;

  return (
    <div className={styles.events}>
      <header className={styles.header}>
        <h3 className={styles.heading}>Recent events: {eventsAmount}</h3>
        <Filters values={filterValues} setValues={setFilterValues} isAnySelected={isAnyFilterSelected} />
      </header>
      {eventsAmount > 0 ? <div className="programs-list">{getEvents()}</div> : <p>There are no events.</p>}
    </div>
  );
};

export { ExplorerEvents };
