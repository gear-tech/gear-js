export class ValidationError extends Error {
  name = 'ValidationError';

  constructor(message: string) {
    super(message);
  }
}
