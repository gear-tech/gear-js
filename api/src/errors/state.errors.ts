import { GearError } from './gear.errors';

export class ReadStateError extends GearError {
  name = 'ReadStateError';

  constructor(message?: string) {
    super(message || 'Unable to read state.');
  }
}

export class ReadStorageError extends GearError {
  name = 'ReadStorageError';

  constructor(message?: string) {
    super(message || 'Unable to read storage.');
  }
}
