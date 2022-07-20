import { WaitlistItem } from '@gear-js/api';

export const getRowKey = (row: WaitlistItem, index: number) => `${row.messageId} ${index}`;
