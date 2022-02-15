import { Methods } from 'types/events-list';

export const filterValues = {
  [Methods.TRANSFER]: false,
  [Methods.LOG]: false,
  [Methods.INIT_SUCCESS]: false,
  [Methods.INIT_FAILURE]: false,
  [Methods.DISPATCH_MESSAGE_ENQUEUED]: false,
  [Methods.MESSAGE_DISPATCHED]: false,
} as const;
