export class BuiltinQueryIdError extends Error {
  name = 'BuiltInQueryIdError';
  message = 'Unable to query id from builtin';

  constructor(message?: string) {
    super();
    this.message = `${this.message} ${message}`;
  }
}
