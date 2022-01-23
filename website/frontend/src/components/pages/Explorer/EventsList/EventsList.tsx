import React, { useEffect, useState } from 'react';
import { Event } from '@polkadot/types/interfaces';
import { useApi } from 'hooks/useApi';
import { EventItem } from './children/EventItem/EventItem';
import { Filters } from './children/Filters/Filters';
import { FilterValues } from 'types/events-list';
import { LOCAL_STORAGE } from 'consts';
import * as init from './init';
import styles from './EventsList.module.scss';

const EventsList = () => {
  const [api] = useApi();
  const [events, setEvents] = useState<Event[]>([]);

  const localFilterValues = localStorage.getItem(LOCAL_STORAGE.EVENT_FILTERS);
  const initFilterValues = localFilterValues ? JSON.parse(localFilterValues) : init.filterValues;
  // TODO: init.filterValues to have it's own type?
  const [filterValues, setFilterValues] = useState<FilterValues>(initFilterValues);
  const isAnyFilterSelected = Object.values(filterValues).includes(true);

  useEffect(() => {
    if (api) {
      api.allEvents((allEvents) => {
        // TODO: .map().filter() to single .reduce()
        const newEvents = allEvents
          .map(({ event }) => event)
          .filter(({ section }) => section !== 'system')
          .reverse();

        setEvents((prevEvents) => [...newEvents, ...prevEvents]);
      });
    }
  }, [api]);

  const isEventSelected = ({ method }: Event) => filterValues[method];
  const filteredEvents = isAnyFilterSelected ? events.filter(isEventSelected) : events;
  const eventsAmount = filteredEvents.length;

  const getEvents = () => filteredEvents.map((event, index) => <EventItem key={index} event={event} />);

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
