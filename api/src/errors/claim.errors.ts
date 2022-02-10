import { GearError } from '.';

export class ClaimValueError extends GearError {
  name = 'ClaimValueError';

  constructor(message?: string) {
    super(message || `Unable to claim value from mailbox. Params are invalid`);
  }
}
