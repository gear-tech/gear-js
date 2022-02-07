import { useState } from 'react';
import { Events } from 'types/explorer';
import { useApi } from './useApi';
import { getEvents } from 'utils/explorer';
import { useSubscription } from './useSubscription';

export function useEvents() {
  const [api] = useApi();
  const [events, setEvents] = useState<Events>([]);

  const subscribeToEvents = () =>
    api.allEvents((eventRecords) => {
      const { createdAtHash } = eventRecords;

      // prolly it's better to pass createdAtHash and to get block number inside Event's header
      if (createdAtHash) {
        api.blocks.getBlockNumber(createdAtHash).then((blockNumber) => {
          const formattedBlockNumber = String(blockNumber.toHuman());
          const newEvents = getEvents(eventRecords, formattedBlockNumber);

          setEvents((prevEvents) => [...newEvents, ...prevEvents]);
        });
      }
    });

  useSubscription(subscribeToEvents);

  return events;
}
