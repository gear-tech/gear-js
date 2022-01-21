import { GearError } from '.';

export class ClaimValueError extends GearError {
  name = 'ClaimValueError';

  constructor(message?: string) {
    super(message || `Can't claim value from mailbox. Params are invalid`);
  }
}
