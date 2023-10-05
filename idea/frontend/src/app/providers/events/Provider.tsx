import { useState, useEffect } from 'react';
import { useApi, ProviderProps } from '@gear-js/react-hooks';

import { IdeaEvent, Section } from 'features/explorer';

import { EventsContext } from './Context';

const EventsProvider = ({ children }: ProviderProps) => {
  const { api, isApiReady } = useApi();
  const [events, setEvents] = useState<IdeaEvent[]>();

  useEffect(() => {
    if (!isApiReady) return;

    const unsub = api.query.system.events(async (records) => {
      const { createdAtHash } = records;
      if (!createdAtHash) return;

      const blockNumber = await api.blocks.getBlockNumber(createdAtHash);

      const newEvents = records
        .map(({ event }) => new IdeaEvent(event, blockNumber))
        .filter(({ section }) => section !== Section.System)
        .reverse();

      setEvents((prevEvents) => (prevEvents ? [...newEvents, ...prevEvents] : newEvents));
    });

    return () => {
      unsub.then((unsubscribe) => unsubscribe());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

  return <EventsContext.Provider value={events}>{children}</EventsContext.Provider>;
};

export { EventsProvider };
