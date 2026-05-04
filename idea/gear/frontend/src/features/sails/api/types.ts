import type { HexString } from '@gear-js/api';

import type { PaginationParameters } from '@/api';
import type { IBase } from '@/shared/types';

type GetEventsParameters = PaginationParameters & {
  service?: string;
  name?: string;
  source?: string;
  from?: string;
  to?: string;
};

type EventType = IBase & {
  id: string;
  source: string;
  payload: HexString | null;
  service?: string | null;
  name?: string | null;
};

type GetIdlResponse = {
  codeId: string;
  data: string;
};

export type { EventType, GetEventsParameters, GetIdlResponse };
