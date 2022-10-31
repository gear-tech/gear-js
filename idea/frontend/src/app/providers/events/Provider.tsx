import { useState, useEffect } from 'react';
import { useApi, ProviderProps } from '@gear-js/react-hooks';

import { IdeaEvent, Section } from 'entities/explorer';

import { EventsContext } from './Context';

const EventsProvider = ({ children }: ProviderProps) => {
  const { api } = useApi();
  const [events, setEvents] = useState<IdeaEvent[]>();

  const subscribeToEvents = () =>
    api.query.system.events(async (records) => {
      const { createdAtHash } = records;

      if (createdAtHash) {
        const blockNumber = await api.blocks.getBlockNumber(createdAtHash);

        const newEvents = records
          .map(({ event }) => new IdeaEvent(event, blockNumber))
          .filter(({ section }) => section !== Section.System)
          .reverse();

        setEvents((prevEvents) => (prevEvents ? [...newEvents, ...prevEvents] : newEvents));
      }
    });

  useEffect(() => {
    if (!api) {
      return;
    }

    const unsub = subscribeToEvents();

    return () => {
      unsub.then((unsubscribe) => unsubscribe());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  return <EventsContext.Provider value={events}>{children}</EventsContext.Provider>;
};

export { EventsProvider };
