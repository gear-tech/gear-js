import { OwnerFilter } from '@/api/consts';

enum ProgramStatus {
  Active = 'active',
  ProgramSet = 'programSet',
  Terminated = 'terminated',
  Paused = 'paused',
  Exited = 'exited',
  Unknown = 'unknown',
}

const PROGRAM_STATUS_NAME = {
  [ProgramStatus.Active as const]: 'Active',
  [ProgramStatus.ProgramSet as const]: 'Program Set',
  [ProgramStatus.Terminated as const]: 'Terminated',
  [ProgramStatus.Paused as const]: 'Paused',
  [ProgramStatus.Exited as const]: 'Exited',
  [ProgramStatus.Unknown as const]: 'Unknown',
};

const DEFAULT_FILTER_VALUES = {
  owner: OwnerFilter.All,
  status: [] as ProgramStatus[],
};

export { ProgramStatus, PROGRAM_STATUS_NAME, DEFAULT_FILTER_VALUES };
