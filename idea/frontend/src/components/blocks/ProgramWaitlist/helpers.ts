import { WaitlistItem } from '@gear-js/api';

import { HumanWaitlistItem } from 'types/api';

export const getRowKey = (row: WaitlistItem, index: number) => {
  const humanWaitlist = row.toHuman() as HumanWaitlistItem;

  return `${humanWaitlist[0].message.id} ${index}`;
};
