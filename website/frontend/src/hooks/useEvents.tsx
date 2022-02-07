import { useEffect, useState } from 'react';
import { UnsubscribePromise } from '@polkadot/api/types';
import { Events } from 'types/explorer';
import { useApi } from './useApi';
import { getEvents } from 'utils/explorer';

export function useEvents() {
  const [api] = useApi();
  const [events, setEvents] = useState<Events>([]);

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (api) {
      unsub = api.allEvents((eventRecords) => {
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
    }

    return () => {
      if (unsub) {
        (async () => {
          (await unsub)();
        })();
      }
    };
  }, [api]);

  return events;
}
