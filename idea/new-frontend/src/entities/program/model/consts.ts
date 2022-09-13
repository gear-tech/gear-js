enum ProgramStatus {
  Success = 'success',
  Failed = 'failed',
  InProgress = 'in progress',
}

const PROGRAM_STATUS_NAME = {
  [ProgramStatus.Success as const]: 'Active',
  [ProgramStatus.Failed as const]: 'Terminated',
  [ProgramStatus.InProgress as const]: 'Paused',
};

export { ProgramStatus, PROGRAM_STATUS_NAME };
