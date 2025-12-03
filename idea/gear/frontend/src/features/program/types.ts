import { OwnerFilter } from '@/api/consts';

import { PROGRAM_TABS, ProgramStatus } from './consts';

type FiltersValues = {
  owner: OwnerFilter;
  status: ProgramStatus[];
};

type ProgramTabId = (typeof PROGRAM_TABS)[number]['id'];

export type { FiltersValues, ProgramTabId };
