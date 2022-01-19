export class GearError extends Error {
  name = 'GearError';
}

export class CreateTypeError extends GearError {
  name = 'CreateTypeError';
  message = `Can't create type.`;

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
