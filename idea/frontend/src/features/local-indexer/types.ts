import { HexString } from '@gear-js/api';

import { Program } from '@/features/program';
import { Code } from '@/features/code';
import { IBase } from '@/shared/types';

type ChainProgram = Pick<Program, 'id' | 'name' | 'status'> & {
  codeId: HexString | null;
};

type DBProgram = IBase & Pick<Program, 'id' | 'name' | 'status' | 'metahash' | 'codeId' | 'owner'>;

type LocalProgram = ChainProgram | DBProgram;

type LocalCode = Pick<Code, 'id' | 'name' | 'metahash'>;

export type { DBProgram, LocalProgram, LocalCode };
