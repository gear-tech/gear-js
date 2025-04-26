export class UnsupportedTargetError extends Error {
  public readonly code = 400;

  constructor(target: string) {
    super(`${target} is not supported`);
  }
}

export class FaucetLimitError extends Error {
  public readonly code = 403;

  constructor() {
    super('The limit for requesting test balance has been reached.');
  }
}

export class InvalidAddress extends Error {
  public readonly code = 400;

  constructor() {
    super('Invalid account address');
  }
}
