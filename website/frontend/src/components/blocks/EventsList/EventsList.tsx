import React, { useEffect, useState } from 'react';
import { Event } from '@polkadot/types/interfaces';
import { useApi } from 'hooks/useApi';
import styles from './EventsList.module.scss';
import clsx from 'clsx';

const EventsList = () => {
  const [api] = useApi();
  const [events, setEvents] = useState<Event[]>([]);

  const getEvents = () =>
    events.map((event, index) => {
      const { section, method, data, meta } = event;
      const { docs } = meta;

      const caption = `${section}.${method}`;

      const eventClassName = clsx('programs-list__item', styles.event);
      const arrowClassName = clsx(styles.arrow, styles.arrowDown);

      return (
        <li className={eventClassName} key={index}>
          <header className={styles.header}>
            <span className={styles.caption}>{caption}</span>
            <span className={arrowClassName} />
            <span className={styles.blockNumber}>0x01</span>
          </header>
          <div className={styles.body}>
            <div className={styles.text}>{docs}</div>
            <div className={styles.payload}></div>
          </div>
        </li>
      );
    });

  useEffect(() => {
    if (api) {
      api.allEvents((allEvents) => {
        // TODO: .map().filter() to single .reduce()
        const newEvents = allEvents.map(({ event }) => event).filter((event) => event.section !== 'system');
        setEvents((prevEvents) => [...newEvents, ...prevEvents]);
      });
    }
  }, [api]);

  console.log(events.map((event) => event.toHuman()));

  return (
    <div className="block-list">
      <h3 className="block-list__header">Recent events: {events.length}</h3>
      <ul className="programs-list">{getEvents()}</ul>
    </div>
  );
};

export { EventsList };
