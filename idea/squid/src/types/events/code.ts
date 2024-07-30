import { Events } from '../../common';
import { Event } from '../../processor';

export interface ICodeChanged {
  id: string;
  change: {
    __kind: 'Active';
  };
}

export type CCodeChanged = Omit<Event, 'args'> & { args: ICodeChanged };

export const isCodeChanged = (obj: any): obj is CCodeChanged => obj.name === Events.CodeChanged;
