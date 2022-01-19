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
      const { section, method, meta, data } = event;
      const { docs } = meta;

      const caption = `${section}.${method}`;
      const params = JSON.stringify(data, null, 2);

      const eventClassName = clsx('programs-list__item', styles.event);
      const arrowClassName = clsx(styles.arrow, styles.arrowDown);
      const paramsClassName = clsx(styles.text, styles.params);

      return (
        <li className={eventClassName} key={index}>
          <header className={styles.header}>
            <div className={styles.headerMain}>
              <span className={styles.caption}>{caption}</span>
              <span className={arrowClassName} />
              <span className={styles.blockNumber}>0x01</span>
            </div>
            <div className={styles.text}>{docs}</div>
          </header>
          <div className={styles.body}>
            <pre className={paramsClassName}>{params}</pre>
          </div>
        </li>
      );
    });

  useEffect(() => {
    if (api) {
      api.allEvents((allEvents) => {
        // TODO: .map().filter() to single .reduce()
        // const newEvents = allEvents.map(({ event }) => event).filter((event) => event.section !== 'system');
        const newEvents = allEvents.map(({ event }) => event);
        setEvents((prevEvents) => [...newEvents, ...prevEvents]);
      });
    }
  }, [api]);

  return (
    <div className="block-list">
      <h3 className="block-list__header">Recent events: {events.length}</h3>
      <ul className="programs-list">{getEvents()}</ul>
    </div>
  );
};

export { EventsList };
