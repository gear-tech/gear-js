import { IMeta } from 'entities/metadata';
import { IProgram } from 'entities/program';
import { IBase } from 'shared/types';

import { CodeStatus } from './consts';

interface ICode extends IBase {
  _id: string;
  id: string;
  name: string;
  status: CodeStatus;
  meta: IMeta;
  programs: IProgram[];
  expiration: string | null;
}

export type { ICode };
