import { IBase } from '@/shared/types';

type GetEventsParameters = {
  service?: string;
  name?: string;
  source?: string;
};

type EventType = IBase & {
  id: string;
  source: string;
  payload: string | null;
  service?: string | null;
  name?: string | null;
};

export type { GetEventsParameters, EventType };
