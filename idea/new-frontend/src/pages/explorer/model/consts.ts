import { Method } from 'entities/explorer';

const FILTER_VALUES = {
  [Method.Transfer]: false,
  [Method.UserMessageSent]: false,
  [Method.MessagesDispatched]: false,
} as const;

const LOCAL_STORAGE = {
  EVENT_FILTERS: 'event_filters',
};

export { FILTER_VALUES, LOCAL_STORAGE };
