import { Events } from '../../common/index.js';
import { Event } from '../../processor.js';

export interface AProgramChanged {
  id: string;
  change: {
    expiration: number;
    __kind: 'ProgramSet' | 'Active' | 'Terminated' | 'Inactive';
  };
}

export type EProgramChanged = { args: AProgramChanged } & Omit<Event, 'args'>;

export const isProgramChanged = (obj: any): obj is EProgramChanged => obj.name === Events.ProgramChanged;
