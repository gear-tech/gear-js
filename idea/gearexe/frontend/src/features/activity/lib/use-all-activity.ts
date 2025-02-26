import { EventLog } from 'ethers';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { useRouterContract, useWrappedVaraContract } from '@/app/api';
import { allActivityAtom, EventsBlock, RouterEvents, WrappedVaraEvents } from '@/app/store';

import { parseEvent } from './parse-event';

const useAllActivity = () => {
  const { routerContract } = useRouterContract();
  const { wrappedVaraContract } = useWrappedVaraContract();
  const allActivity = useAtomValue(allActivityAtom);

  const setAllActivity = useSetAtom(allActivityAtom);
  useEffect(() => {
    if (!routerContract || !wrappedVaraContract) return;

    const addActivity = (eventLog: EventLog) => {
      const event = parseEvent(eventLog);
      if (!event) return;

      const isEmptyEvent = event.type === RouterEvents.blockCommitted;
      const { blockNumber, blockHash } = eventLog;

      setAllActivity((prev) => {
        const sameBlockIndex = prev.findIndex((block) => block.blockHash === blockHash);

        if (sameBlockIndex !== -1) {
          // Add event to existing block
          const next = [...prev];
          if (!isEmptyEvent) {
            next[sameBlockIndex].events.push(event);
          }
          return next;
        }

        // Create a new block
        const newActivityBlock: EventsBlock = {
          blockHash,
          blockNumber,
          timestamp: Date.now(),
          events: isEmptyEvent ? [] : [event],
        };
        return [newActivityBlock, ...prev];
      });
    };

    const subscribeToEvents = (contract: typeof routerContract | typeof wrappedVaraContract, events: string[]) => {
      events.forEach((event) => {
        void contract.on(event, (...args: unknown[]) => {
          const lastArg = args[args.length - 1] as { log: EventLog };
          addActivity(lastArg.log);
        });
      });
    };

    const unsubscribeFromEvents = (contract: typeof routerContract | typeof wrappedVaraContract, events: string[]) => {
      events.forEach((event) => {
        void contract.off(event);
      });
    };

    const routerEvents = Object.values(RouterEvents);
    const wrappedVaraEvents = Object.values(WrappedVaraEvents);

    subscribeToEvents(routerContract, routerEvents);
    subscribeToEvents(wrappedVaraContract, wrappedVaraEvents);

    return () => {
      unsubscribeFromEvents(routerContract, routerEvents);
      unsubscribeFromEvents(wrappedVaraContract, wrappedVaraEvents);
    };
  }, [routerContract, wrappedVaraContract, setAllActivity]);

  return allActivity;
};

export { useAllActivity };
