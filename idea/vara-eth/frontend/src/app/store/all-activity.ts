import { atom } from 'jotai';

const RouterEvents = {
  programCreated: 'ProgramCreated',
  codeGotValidated: 'CodeGotValidated',
  codeValidationRequested: 'CodeValidationRequested',
  blockCommitted: 'BlockCommitted',
} as const;

type RouterEvent =
  | { type: typeof RouterEvents.programCreated; actorId: string; codeId: string }
  | { type: typeof RouterEvents.codeGotValidated; codeId: string; valid: boolean }
  | { type: typeof RouterEvents.codeValidationRequested; codeId: string; blobTxHash: string }
  | { type: typeof RouterEvents.blockCommitted; hash: string };

const WrappedVaraEvents = {
  approval: 'Approval',
  transfer: 'Transfer',
} as const;

type WrappedVaraEvent =
  | { type: typeof WrappedVaraEvents.approval; owner: string; spender: string; value: string }
  | { type: typeof WrappedVaraEvents.transfer; from: string; to: string; value: string };

type AllEvents = RouterEvent | WrappedVaraEvent;

type EventsBlock = {
  blockHash: string;
  blockNumber: number;
  timestamp: number;
  events: AllEvents[];
};

type AllActivity = EventsBlock[];

const allActivityAtom = atom<AllActivity>([]);

export { allActivityAtom, RouterEvents, WrappedVaraEvents, type AllEvents, type EventsBlock };
