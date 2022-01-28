import React, { useState } from 'react';
import { EventItem } from './children/EventItem/EventItem';
import { Filters } from './children/Filters/Filters';
import { EventGroup, FilterValues, GroupedEventsProps } from 'types/events-list';
import { LOCAL_STORAGE } from 'consts';
import * as init from './init';
import styles from './EventsList.module.scss';

const EventsList = ({ groupedEvents }: GroupedEventsProps) => {
  const localFilterValues = localStorage.getItem(LOCAL_STORAGE.EVENT_FILTERS);
  const initFilterValues: FilterValues = localFilterValues ? JSON.parse(localFilterValues) : init.filterValues;
  const [filterValues, setFilterValues] = useState(initFilterValues);
  const isAnyFilterSelected = Object.values(filterValues).includes(true);

  const isEventSelected = ({ method }: EventGroup) => filterValues[method];
  const filteredEvents = isAnyFilterSelected ? groupedEvents.filter(isEventSelected) : groupedEvents;
  const eventsAmount = filteredEvents.length;

  const getEvents = () => filteredEvents.map((group) => <EventItem key={group.id} group={group} />);

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
