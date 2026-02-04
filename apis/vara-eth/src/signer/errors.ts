export class SigningError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'SigningError';
    Object.setPrototypeOf(this, SigningError.prototype);
  }
}

export class AddressError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'AddressError';
    Object.setPrototypeOf(this, AddressError.prototype);
  }
}
