export class ClaimValueError extends Error {
  name = 'ClaimValueError';

  constructor(message?: string) {
    super(message || 'Unable to claim value from mailbox. Params are invalid');
  }
}
