import { Program } from '@/features/program';
import { IBase } from '@/shared/types';

type LocalProgram = Pick<Program, 'id' | 'name' | 'status' | 'metahash' | 'code' | 'hasState'> &
  Partial<Pick<IBase, 'timestamp' | 'blockHash'>>;

export type { LocalProgram };
