import { HexString } from '@polkadot/util/types';
import { ICode } from 'entities/code';
import { IMessage } from 'entities/message';
import { IBase } from 'shared/types';

import { ProgramStatus } from './consts';

interface IProgram extends IBase {
  id: HexString;
  owner: string;
  name: string;
  status: ProgramStatus;
  messages: IMessage[];
  metahash: HexString | null;
  title: string | null;
  expiration?: number;
  code?: ICode;
}

export type { IProgram };
