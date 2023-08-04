import { HexString } from '@polkadot/util/types';
import { ICode } from 'entities/code';
import { IBase } from 'shared/types';

import { ProgramStatus } from './consts';

interface IProgram extends IBase {
  id: HexString;
  owner: string;
  name: string;
  status: ProgramStatus;
  metahash: HexString | null;
  title: string | null;
  hasState: boolean;
  expiration?: number;
  code?: ICode;
}

export type { IProgram };
