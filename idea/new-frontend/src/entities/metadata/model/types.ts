import { ICode } from 'entities/code';
import { IProgram } from 'entities/program';

interface IMeta {
  id: string;
  program: string;
  owner: string;
  code: ICode;
  programs: IProgram[];
  meta: string | null;
  metaWasm: string | null;
}

export type { IMeta };
