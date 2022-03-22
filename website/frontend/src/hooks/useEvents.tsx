import { useState } from 'react';
import { IdeaEvent, IdeaEvents, Sections } from 'types/explorer';
import { useApi } from './useApi';
import { useSubscription } from './useSubscription';

export function useEvents() {
  const [api] = useApi();
  const [events, setEvents] = useState<IdeaEvents>([]);

  const subscribeToEvents = () =>
    api.query.system.events(async (records) => {
      const { createdAtHash } = records;

      if (createdAtHash) {
        const blockNumber = await api.blocks.getBlockNumber(createdAtHash);

        const newEvents = records
          .map(({ event }) => new IdeaEvent(event, blockNumber))
          .filter(({ section }) => section !== Sections.SYSTEM)
          .reverse();

        setEvents((prevEvents) => [...newEvents, ...prevEvents]);
      }
    });

  useSubscription(subscribeToEvents);

  return events;
}
