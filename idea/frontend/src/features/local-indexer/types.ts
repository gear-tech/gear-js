import { HexString } from '@gear-js/api';

import { Program } from '@/features/program';
import { IBase } from '@/shared/types';
import { ICode } from '@/entities/code';

type ChainProgram = Pick<Program, 'id' | 'name' | 'status' | 'metahash'> & {
  codeId: HexString | null;
};

type DBProgram = IBase & Pick<Program, 'id' | 'name' | 'status' | 'metahash' | 'codeId' | 'owner' | 'hasState'>;

type LocalProgram = ChainProgram | DBProgram;

type LocalCode = Pick<ICode, 'id' | 'name' | 'metahash'>;

export type { DBProgram, LocalProgram, LocalCode };
