import { ICode } from 'entities/code';
import { IMessage } from 'entities/message';
import { IMeta } from 'entities/metadata';
import { IBase } from 'shared/types';

import { ProgramStatus } from './consts';

interface IProgram extends IBase {
  _id: string;
  id: string;
  owner: string;
  name: string;
  status: ProgramStatus;
  messages: IMessage[];
  title: string | null;
  expiration: number | null;
  code: ICode | null;
  meta: IMeta | null;
}

export type { IProgram };
