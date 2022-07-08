export class GearError extends Error {
  name = 'GearError';
}

export class CreateTypeError extends GearError {
  name = 'CreateTypeError';
  message = 'Unable to create type.';

  constructor(message?: string) {
    super();
    this.message = `${this.message} ${message}`;
  }
}

export class TransactionError extends GearError {
  name = 'TransactionError';

  constructor(message: string) {
    super();
    this.message = `${message}`;
  }
}
