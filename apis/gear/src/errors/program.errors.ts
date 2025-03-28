export class SubmitProgramError extends Error {
  name = 'SubmitProgramError';

  constructor(message?: string | undefined) {
    super(message || 'Unable to submit the program. Params are invalid');
  }
}

export class ProgramDoesNotExistError extends Error {
  name = 'ProgramDoesNotExist';

  constructor(id: string) {
    super(`Program with id ${id} does not exist`);
  }
}

export class PausedProgramDoesNotExistError extends Error {
  name = 'PausedProgramDoesNotExistError';

  constructor(id: string) {
    super(`Program with id ${id} not found in paused program storage`);
  }
}

export class GetGasSpentError extends Error {
  name = 'GetGasSpentError';

  constructor(message?: string) {
    super(message ? `Unable to get gasSpent. ${message}` : 'Unable to get gasSpent. Params are invalid');
  }
}

export class ProgramTerminatedError extends Error {
  name = 'ProgramTerminated';

  constructor(id: string) {
    super(`Program ${id} terminated`);
  }
}

export class ProgramExitedError extends Error {
  name = 'ProgramExited';

  constructor(id: string) {
    super(`Program ${id} exited`);
  }
}

export class CodeDoesNotExistError extends Error {
  name = 'CodeDoesNotExist';

  constructor(id: string) {
    super(`Code with id ${id} not found in the storage`);
  }
}

export class ProgramHasNoMetahash extends Error {
  name = 'ProgramHasNoMetahash';

  constructor(id: string) {
    super(`Program with id ${id} has not metahash function`);
  }
}

export class ResumeSessionInitError extends Error {
  name = 'ResumeSessionInitError';

  constructor(programId: string, msg?: string) {
    super(`Resume session init for program ${programId} failed. ${msg ? msg : ''}`);
  }
}

export class ResumeSessionPushError extends Error {
  name = 'ResumeSessionPushError';

  constructor(sessionId: string | number | bigint, msg?: string) {
    super(`Failed to push pages to session ${sessionId}. ${msg || ''}`);
  }
}

export class ResumeSessionCommitError extends Error {
  name = 'ResumeSessionCommitError';

  constructor(sessionId: string | number | bigint, msg?: string) {
    super(`Failed to commit session ${sessionId}. ${msg || ''}`);
  }
}
