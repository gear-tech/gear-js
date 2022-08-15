import { Method } from 'types/explorer';

export const FILTER_VALUES = {
  [Method.Transfer]: false,
  [Method.UserMessageSent]: false,
  [Method.MessagesDispatched]: false,
} as const;
