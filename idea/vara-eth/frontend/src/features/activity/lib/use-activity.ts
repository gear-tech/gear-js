import { HexString } from '@vara-eth/api';
import { IROUTER_ABI, IWRAPPEDVARA_ABI } from '@vara-eth/api/abi';
import { useEffect, useState } from 'react';
import { ContractEventName, WatchContractEventOnLogsParameter } from 'viem';
import { useConfig } from 'wagmi';
import { watchContractEvent } from 'wagmi/actions';

import { useEthereumClient } from '@/app/api';

// router events

const EVENT_NAME = {
  ROUTER: {
    CODE_VALIDATION_REQUESTED: 'CodeValidationRequested',
    CODE_GOT_VALIDATED: 'CodeGotValidated',
    PROGRAM_CREATED: 'ProgramCreated',
    ANNOUNCES_COMMITTED: 'AnnouncesCommitted',
    BATCH_COMMITTED: 'BatchCommitted',
    COMPUTATION_SETTINGS_CHANGED: 'ComputationSettingsChanged',
    STORAGE_SLOT_CHANGED: 'StorageSlotChanged',
    VALIDATORS_COMMITTED_FOR_ERA: 'ValidatorsCommittedForEra',
  },

  WVARA: {
    APPROVAL: 'Approval',
    TRANSFER: 'Transfer',
  },
} as const;

type CodeValidationRequestedEvent = {
  name: typeof EVENT_NAME.ROUTER.CODE_VALIDATION_REQUESTED;
  args: { codeId: HexString };
};

type CodeValidatedEvent = {
  name: typeof EVENT_NAME.ROUTER.CODE_GOT_VALIDATED;
  args: { codeId: HexString; valid: boolean };
};

type ProgramCreatedEvent = {
  name: typeof EVENT_NAME.ROUTER.PROGRAM_CREATED;
  args: { actorId: HexString; codeId: HexString };
};

type AnnouncesCommittedEvent = {
  name: typeof EVENT_NAME.ROUTER.ANNOUNCES_COMMITTED;
  args: { head: HexString };
};

type BatchCommittedEvent = {
  name: typeof EVENT_NAME.ROUTER.BATCH_COMMITTED;
  args: { hash: HexString };
};

type ComputationSettingsChangedEvent = {
  name: typeof EVENT_NAME.ROUTER.COMPUTATION_SETTINGS_CHANGED;
  args: { threshold: bigint; wvaraPerSecond: bigint };
};

type StorageSlotChangedEvent = {
  name: typeof EVENT_NAME.ROUTER.STORAGE_SLOT_CHANGED;
  args: object;
};

type ValidatorsCommittedForEraEvent = {
  name: typeof EVENT_NAME.ROUTER.VALIDATORS_COMMITTED_FOR_ERA;
  args: { eraIndex: bigint };
};

// wvara events

type ApprovalEvent = {
  name: typeof EVENT_NAME.WVARA.APPROVAL;
  args: { owner: HexString; spender: HexString; value: bigint };
};

type TransferEvent = {
  name: typeof EVENT_NAME.WVARA.TRANSFER;
  args: { from: HexString; to: HexString; value: bigint };
};

type Event =
  | CodeValidationRequestedEvent
  | CodeValidatedEvent
  | ProgramCreatedEvent
  | AnnouncesCommittedEvent
  | BatchCommittedEvent
  | ComputationSettingsChangedEvent
  | StorageSlotChangedEvent
  | ValidatorsCommittedForEraEvent
  | ApprovalEvent
  | TransferEvent;

type Activity = {
  blockHash: HexString;
  blockNumber: bigint;
  timestamp: number;
  events: Event[];
};

const ROUTER_EVENTS = Object.values(EVENT_NAME.ROUTER);
const WVARA_EVENTS = Object.values(EVENT_NAME.WVARA);

const useActivity = () => {
  const { data: ethereumClient } = useEthereumClient();
  const config = useConfig();

  const [state, setState] = useState<Activity[]>([]);

  useEffect(() => {
    if (!ethereumClient) return;

    const blockHashToEvents: Record<HexString, Activity> = {};

    const processLogs = (
      expectedEventName: ContractEventName<typeof IROUTER_ABI | typeof IWRAPPEDVARA_ABI>,
      logs: WatchContractEventOnLogsParameter<
        typeof IROUTER_ABI | typeof IWRAPPEDVARA_ABI,
        typeof expectedEventName,
        true
      >,
    ) => {
      logs.forEach(({ eventName, blockHash, blockNumber, args }) => {
        if (eventName !== expectedEventName) throw new Error(`${expectedEventName} event was expected`);

        if (!blockHashToEvents[blockHash]) {
          blockHashToEvents[blockHash] = { blockHash, blockNumber, timestamp: Date.now(), events: [] };
        }

        blockHashToEvents[blockHash].events.push({ name: eventName, args } as Event);
      });

      setState(Object.values(blockHashToEvents));
    };

    const unwatchFunctions: (() => void)[] = [];

    ROUTER_EVENTS.forEach((eventName) => {
      const unwatch = watchContractEvent(config, {
        address: ethereumClient.router.address,
        abi: IROUTER_ABI,
        eventName,
        strict: true,
        onLogs: (logs) => processLogs(eventName, logs),
      });

      unwatchFunctions.push(unwatch);
    });

    WVARA_EVENTS.forEach((eventName) => {
      const unwatch = watchContractEvent(config, {
        address: ethereumClient.wvara.address,
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
  }, [ethereumClient, config]);

  return state;
};

export { EVENT_NAME, useActivity };
export type { Event };
