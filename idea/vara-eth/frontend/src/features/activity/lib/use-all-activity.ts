import { RouterClient, WrappedVaraClient } from '@vara-eth/api';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { useEthereumClient } from '@/app/api';
import { allActivityAtom, RouterEvents, WrappedVaraEvents } from '@/app/store';

const useAllActivity = () => {
  const { data: ethereumClient } = useEthereumClient();
  const allActivity = useAtomValue(allActivityAtom);

  const setAllActivity = useSetAtom(allActivityAtom);
  useEffect(() => {
    if (!ethereumClient) return;

    // const addActivity = (eventLog: EventLog) => {
    //   const event = parseEvent(eventLog);
    //   if (!event) return;

    //   const isEmptyEvent = event.type === RouterEvents.blockCommitted;
    //   const { blockNumber, blockHash } = eventLog;

    //   setAllActivity((prev) => {
    //     const sameBlockIndex = prev.findIndex((block) => block.blockHash === blockHash);

    //     if (sameBlockIndex !== -1) {
    //       // Add event to existing block
    //       const next = [...prev];
    //       if (!isEmptyEvent) {
    //         next[sameBlockIndex].events.push(event);
    //       }
    //       return next;
    //     }

    //     // Create a new block
    //     const newActivityBlock: EventsBlock = {
    //       blockHash,
    //       blockNumber,
    //       timestamp: Date.now(),
    //       events: isEmptyEvent ? [] : [event],
    //     };
    //     return [newActivityBlock, ...prev];
    //   });
    // };

    const subscribeToEvents = (_contract: RouterClient | WrappedVaraClient, events: string[]) => {
      events.forEach((_event) => {
        // void contract.on(event, (...args: unknown[]) => {
        //   const lastArg = args[args.length - 1] as { log: EventLog };
        //   addActivity(lastArg.log);
        // });
      });
    };

    const unsubscribeFromEvents = (_contract: RouterClient | WrappedVaraClient, events: string[]) => {
      events.forEach((_event) => {
        // void contract.off(event);
      });
    };

    const routerEvents = Object.values(RouterEvents);
    const wrappedVaraEvents = Object.values(WrappedVaraEvents);

    subscribeToEvents(ethereumClient.router, routerEvents);
    subscribeToEvents(ethereumClient.wvara, wrappedVaraEvents);

    return () => {
      unsubscribeFromEvents(ethereumClient.router, routerEvents);
      unsubscribeFromEvents(ethereumClient.wvara, wrappedVaraEvents);
    };
  }, [ethereumClient, setAllActivity]);

  return allActivity;
};

export { useAllActivity };
