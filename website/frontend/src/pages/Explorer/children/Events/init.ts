import { Methods } from 'types/explorer';

export const filterValues = {
  [Methods.TRANSFER]: false,
  [Methods.USER_MESSAGE_SENT]: false,
  [Methods.MESSAGES_DISPATCHED]: false,
} as const;
