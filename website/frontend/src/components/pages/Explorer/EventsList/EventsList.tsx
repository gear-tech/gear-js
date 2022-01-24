import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Event } from '@polkadot/types/interfaces';
import { EventItem } from './children/EventItem/EventItem';
import { Filters } from './children/Filters/Filters';
import { FilterValues } from 'types/events-list';
import { LOCAL_STORAGE } from 'consts';
import { RootState } from 'store/reducers';
import * as init from './init';
import { getCaption } from './helpers';
import styles from './EventsList.module.scss';

const selectEvents = (state: RootState) => state.events.list;

const EventsList = () => {
  const localFilterValues = localStorage.getItem(LOCAL_STORAGE.EVENT_FILTERS);
  const initFilterValues = localFilterValues ? JSON.parse(localFilterValues) : init.filterValues;
  // TODO: init.filterValues to have it's own type?
  const [filterValues, setFilterValues] = useState<FilterValues>(initFilterValues);
  const isAnyFilterSelected = Object.values(filterValues).includes(true);

  const events = useSelector(selectEvents);
  const isEventSelected = ({ method }: Event) => filterValues[method];
  const filteredEvents = isAnyFilterSelected ? events.filter(isEventSelected) : events;
  const eventsAmount = filteredEvents.length;

  // TODO: combine with above .filter()
  const getGroupedEvents = () =>
    filteredEvents.reduce((eventsAccumulator: Event[][], event, index) => {
      const prevEvent = filteredEvents[index - 1];
      const prevCaption = prevEvent ? getCaption(prevEvent) : undefined;
      const caption = getCaption(event);

      if (prevCaption !== caption) {
        eventsAccumulator.push([]);
      }

      const lastIndex = eventsAccumulator.length - 1;
      const lastGroup = eventsAccumulator[lastIndex];
      lastGroup.unshift(event);

      return eventsAccumulator;
    }, []);

  const getEvents = () => getGroupedEvents().map((group, index) => <EventItem key={index} group={group} />);

  return (
    <div className={styles.events}>
      <header className={styles.header}>
        <h3 className={styles.heading}>Recent events: {eventsAmount}</h3>
        <Filters values={filterValues} setValues={setFilterValues} isAnySelected={isAnyFilterSelected} />
      </header>
      {eventsAmount > 0 ? <ul className="programs-list">{getEvents()}</ul> : <p>There are no events.</p>}
    </div>
  );
};

export { EventsList };
