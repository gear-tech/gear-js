import type { OwnerFilter } from '@/api/consts';

import type { ProgramStatus } from './consts';

type FiltersValues = {
  owner: OwnerFilter;
  status: ProgramStatus[];
};

export type { FiltersValues };
