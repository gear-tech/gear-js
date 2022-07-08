import { GearError } from './gear.errors';

export class ClaimValueError extends GearError {
  name = 'ClaimValueError';

  constructor(message?: string) {
    super(message || 'Unable to claim value from mailbox. Params are invalid');
  }
}
