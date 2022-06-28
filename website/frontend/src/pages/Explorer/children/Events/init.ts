import { Method } from 'types/explorer';

export const filterValues = {
  [Method.Transfer]: false,
  [Method.UserMessageSent]: false,
  [Method.MessagesDispatched]: false,
} as const;
