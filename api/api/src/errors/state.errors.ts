import { GearError } from '.';

export class ReadStateError extends GearError {
  name = 'ReadStateError';

  constructor(message?: string) {
    super(message || `Can't read state.`);
  }
}
