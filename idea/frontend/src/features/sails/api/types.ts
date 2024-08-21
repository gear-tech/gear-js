import { HexString } from '@gear-js/api';

import { PaginationParameters } from '@/api';
import { IBase } from '@/shared/types';

type GetEventsParameters = PaginationParameters & {
  service?: string;
  name?: string;
  source?: string;
};

type EventType = IBase & {
  id: string;
  source: string;
  payload: HexString | null;
  service?: string | null;
  name?: string | null;
};

export type { GetEventsParameters, EventType };
