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
  whitelist: [] as string[],
};

// tabs

const PROGRAM_TAB_ID = {
  MESSAGES: 'messages',
  EVENTS: 'events',
  VOUCHERS: 'vouchers',
  METADATA: 'metadata',
} as const;

const PROGRAM_TABS = [
  { id: PROGRAM_TAB_ID.MESSAGES, label: 'Messages' },
  { id: PROGRAM_TAB_ID.EVENTS, label: 'Events' },
  { id: PROGRAM_TAB_ID.VOUCHERS, label: 'Vouchers' },
  { id: PROGRAM_TAB_ID.METADATA, label: 'Metadata/Sails' },
] as const;

export { ProgramStatus, PROGRAM_STATUS_NAME, DEFAULT_FILTER_VALUES, PROGRAM_TABS, PROGRAM_TAB_ID };
