import { HexString } from '@gear-js/api';

import { IBase } from '@/shared/types';

import { CodeStatus } from './consts';

interface ICode extends IBase {
  id: HexString;
  name: string;
  status: CodeStatus;
  metahash: HexString | null;
  hasState: boolean;
  uploadedBy?: HexString;
}

export type { ICode };
