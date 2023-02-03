enum ProgramStatus {
  Unknown = 'unknown',
  Active = 'active',
  Terminated = 'terminated',
  InitFailed = 'init_failed',
  Paused = 'paused',
  Exited = 'exited',

  // TODO: old ones
  // Success = 'success',
  // Failed = 'failed',
  // InProgress = 'in progress',
}

const PROGRAM_STATUS_NAME = {
  [ProgramStatus.Unknown as const]: 'Unknown',
  [ProgramStatus.Active as const]: 'Active',
  [ProgramStatus.Terminated as const]: 'Terminated',
  [ProgramStatus.InitFailed as const]: 'Terminated',
  [ProgramStatus.Paused as const]: 'Paused',
  [ProgramStatus.Exited as const]: 'Exited',
};

export { ProgramStatus, PROGRAM_STATUS_NAME };
