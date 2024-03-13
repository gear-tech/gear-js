import { Program } from '@/features/program';
import { IBase } from '@/shared/types';
import { HexString } from '@gear-js/api';

type LocalProgram = Pick<Program, 'id' | 'name' | 'status' | 'metahash' | 'hasState'> &
  Partial<Pick<IBase, 'timestamp' | 'blockHash'>> & { codeId: HexString | null };

export type { LocalProgram };
