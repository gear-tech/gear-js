import { IROUTER_ABI, IWRAPPEDVARA_ABI } from '@vara-eth/api/abi';
import { useEffect, useState } from 'react';
import {
  ContractEventName,
  WatchContractEventOnLogsParameter,
  AbiEventParametersToPrimitiveTypes,
  Abi,
  Hex,
} from 'viem';
import { useConfig } from 'wagmi';
import { watchContractEvent } from 'wagmi/actions';

import { useVaraEthApi } from '@/app/providers';

type RouterAbi = typeof IROUTER_ABI;
type WVaraAbi = typeof IWRAPPEDVARA_ABI;

type GetEvent<
  TAbi extends Abi,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  TEvents extends { type: 'event'; name: string; inputs: readonly any[] } = Extract<TAbi[number], { type: 'event' }>,
> = TEvents extends any
  ? {
      name: TEvents['name'];

      args: AbiEventParametersToPrimitiveTypes<
        TEvents['inputs'],
        { EnableUnion: false; IndexedOnly: false; Required: true }
      >;
    }
  : never;

type Event = GetEvent<RouterAbi> | GetEvent<WVaraAbi>;
type EventArgs<T extends Event['name']> = Extract<Event, { name: T }>['args'];

type Activity = {
  blockHash: Hex;
  blockNumber: bigint;
  timestamp: number;
  events: Event[];
};

const ROUTER_EVENTS = IROUTER_ABI.filter((item) => item.type === 'event').map((event) => event.name);
const WVARA_EVENTS = IWRAPPEDVARA_ABI.filter((item) => item.type === 'event').map((event) => event.name);

const useActivity = () => {
  const { api } = useVaraEthApi();
  const config = useConfig();

  const [state, setState] = useState<Activity[]>([]);

  useEffect(() => {
    if (!api) return;

    const blockHashToEvents: Record<Hex, Activity> = {};

    const processLogs = (
      expectedEventName: ContractEventName<RouterAbi | WVaraAbi>,
      logs: WatchContractEventOnLogsParameter<RouterAbi | WVaraAbi, typeof expectedEventName, true>,
    ) => {
      logs.forEach(({ eventName, blockHash, blockNumber, args }) => {
        if (eventName !== expectedEventName) throw new Error(`${expectedEventName} event was expected`);

        if (!blockHashToEvents[blockHash]) {
          blockHashToEvents[blockHash] = { blockHash, blockNumber, timestamp: Date.now(), events: [] };
        }

        blockHashToEvents[blockHash].events.push({ name: eventName, args } as Event);
      });

      setState(Object.values(blockHashToEvents).sort((prev, next) => Number(next.blockNumber - prev.blockNumber)));
    };

    const unwatchFunctions: (() => void)[] = [];

    ROUTER_EVENTS.forEach((eventName) => {
      const unwatch = watchContractEvent(config, {
        address: api.eth.router.address,
        abi: IROUTER_ABI,
        eventName,
        strict: true,
        onLogs: (logs) => processLogs(eventName, logs),
      });

      unwatchFunctions.push(unwatch);
    });

    WVARA_EVENTS.forEach((eventName) => {
      const unwatch = watchContractEvent(config, {
        address: api.eth.wvara.address,
        abi: IWRAPPEDVARA_ABI,
        eventName,
        strict: true,
        onLogs: (logs) => processLogs(eventName, logs),
      });

      unwatchFunctions.push(unwatch);
    });

    return () => {
      unwatchFunctions.forEach((unwatch) => unwatch());
    };
  }, [api, config]);

  return state;
};

export { useActivity };
export type { Event, EventArgs };
