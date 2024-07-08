import { HexString } from '@gear-js/api';

import { Program } from '@/features/program';
import { IBase } from '@/shared/types';
import { ICode } from '@/entities/code';

type LocalProgram = Pick<Program, 'id' | 'name' | 'status' | 'hasState'> &
  Partial<Pick<IBase, 'timestamp' | 'blockHash' | 'genesis'>> & {
    codeId: HexString | null;
    owner?: HexString;
    metahash?: HexString | null;
  };

type LocalCode = Pick<ICode, 'id' | 'name' | 'metahash'>;

export type { LocalProgram, LocalCode };
