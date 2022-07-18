export class ReadStateError extends Error {
  name = 'ReadStateError';

  constructor(message?: string) {
    super(message || 'Unable to read state.');
  }
}

export class ReadStorageError extends Error {
  name = 'ReadStorageError';

  constructor(message?: string) {
    super(message || 'Unable to read storage.');
  }
}
