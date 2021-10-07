import { GearError } from '.';

export class SendMessageError extends GearError {
  name = 'SendMessageError';

  constructor(message?: string) {
    super(message || `Can't send message. Params are invalid`);
  }
}
