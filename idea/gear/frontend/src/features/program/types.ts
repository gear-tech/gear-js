import { OwnerFilter } from '@/api/consts';

import { PROGRAM_TAB_ID, ProgramStatus } from './consts';

type FiltersValues = {
  owner: OwnerFilter;
  status: ProgramStatus[];
};

type ProgramTabId = (typeof PROGRAM_TAB_ID)[keyof typeof PROGRAM_TAB_ID];

export type { FiltersValues, ProgramTabId };
