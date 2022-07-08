import { GearError } from './gear.errors';

export class SubmitProgramError extends GearError {
  name = 'SubmitProgramError';

  constructor(message?: string) {
    super(message || 'Unable to submit the program. Params are invalid');
  }
}

export class GetGasSpentError extends GearError {
  name = 'GetGasSpentError';

  constructor(message?: string) {
    super(`Unable to get gasSpent. ${message}` || 'Unable to get gasSpent. Params are invalid');
  }
}
