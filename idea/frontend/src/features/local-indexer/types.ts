import { IProgram } from 'features/program';

type LocalProgram = Pick<IProgram, 'id' | 'name' | 'status'>;

export type { LocalProgram };
