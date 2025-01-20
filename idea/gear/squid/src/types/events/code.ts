import { Events } from '../../common';
import { Event } from '../../processor';

export interface ACodeChanged {
  id: string;
  change: {
    __kind: 'Active';
  };
}

export type ECodeChanged = Omit<Event, 'args'> & { args: ACodeChanged };

export const isCodeChanged = (obj: any): obj is ECodeChanged => obj.name === Events.CodeChanged;
