export class CreateTypeError extends Error {
  name = 'CreateTypeError';
  message = 'Unable to create type.';

  constructor(message?: string) {
    super();
    this.message = `${this.message} ${message}`;
  }
}

export class TransactionError extends Error {
  name = 'TransactionError';

  constructor(message: string) {
    super();
    this.message = `${message}`;
  }
}
