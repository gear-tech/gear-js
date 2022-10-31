export class SubmitProgramError extends Error {
  name = 'SubmitProgramError';

  constructor(message?: string) {
    super(message || 'Unable to submit the program. Params are invalid');
  }
}

export class ProgramDoesNotExistError extends Error {
  name = 'ProgramDoesNotExist';

  constructor() {
    super('Program does not exist');
  }
}

export class GetGasSpentError extends Error {
  name = 'GetGasSpentError';

  constructor(message?: string) {
    super(`Unable to get gasSpent. ${message}` || 'Unable to get gasSpent. Params are invalid');
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
