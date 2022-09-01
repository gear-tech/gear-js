import { FormValues } from 'features/filters';
import { ProgramStatus } from 'entities/program';

type FiltersValues = FormValues & {
  owner: string;
  status: ProgramStatus[];
  createAt: string;
};

export type { FiltersValues };
