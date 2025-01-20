export class BuiltinQueryIdError extends Error {
  name = 'BuiltInQueryIdError';
  message = 'Unable to query builtin id';

  constructor(message?: string) {
    super();
    this.message = `${this.message}. ${message}`;
  }
}
