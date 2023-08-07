import { HexString } from '@gear-js/api';

import { IProgram } from 'entities/program';
import { IBase } from 'shared/types';

import { CodeStatus } from './consts';

interface ICode extends IBase {
  id: HexString;
  name: string;
  status: CodeStatus;
  expiration: string | null;
  uploadedBy: string;
  metahash: HexString | null;
  programs?: IProgram[];
}

export type { ICode };
