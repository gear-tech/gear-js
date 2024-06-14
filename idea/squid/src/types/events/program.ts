import { Events } from '../../common';
import { Event } from '../../processor';

export interface AProgramChanged {
  id: string;
  change: {
    expiration: number;
    __kind: 'ProgramSet' | 'Active' | 'Terminated' | 'Inactive';
  };
}

export type CProgramChanged = { args: AProgramChanged } & Omit<Event, 'args'>;

export const isProgramChanged = (obj: any): obj is CProgramChanged => obj.name === Events.ProgramChanged;
