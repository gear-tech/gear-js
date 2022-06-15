import { useState } from 'react';
import { Event } from '../../common/Event/Event';
import { Filters } from './Filters/Filters';
import { FilterValues, IdeaEventsProps, IdeaEvent, GroupedEvents } from 'types/explorer';
import { LOCAL_STORAGE } from 'consts';
import * as init from './init';
import styles from './Events.module.scss';

const Events = ({ events }: IdeaEventsProps) => {
  const localFilterValues = localStorage.getItem(LOCAL_STORAGE.EVENT_FILTERS);
  const initFilterValues: FilterValues = localFilterValues ? JSON.parse(localFilterValues) : init.filterValues;
  const [filterValues, setFilterValues] = useState(initFilterValues);
  const isAnyFilterSelected = Object.values(filterValues).includes(true);

  const isEventSelected = ({ method }: IdeaEvent) => filterValues[method];
  const filteredEvents = isAnyFilterSelected ? events.filter(isEventSelected) : events;
  const eventsAmount = filteredEvents.length;

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

export { Events };
