import { OwnerFilter } from '@/api/consts';

import { ProgramStatus } from './consts';

type FiltersValues = {
  owner: OwnerFilter;
  status: ProgramStatus[];
};

export type { FiltersValues };
