import { GearError } from './gear.errors';

export class SubmitProgramError extends GearError {
  name = 'SubmitProgramError';

  constructor(message?: string) {
    super(message || `Can't submit program. Params are invalid`);
  }
}
