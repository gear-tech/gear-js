export class AuthoritySetHashError extends Error {
  name = 'AuthoritySetHashError';
  message = 'Unable to get authority set hash';

  constructor(message?: string) {
    super();
    this.message = `${this.message}. ${message}`;
  }
}

export class ClearTimerError extends Error {
  name = 'ClearTimerError';
  message = "Can't clear timer";

  constructor(message?: string) {
    super();
    this.message = `${this.message}. ${message}`;
  }
}

export class GetQueueMerkleRootError extends Error {
  name = 'GetQueueMerkleRootError';
  message = 'Unable to get queue merkle root';

  constructor(message?: string) {
    super();
    this.message = `${this.message}. ${message}`;
  }
}
