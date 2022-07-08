import { GearError } from './gear.errors';

export class SendMessageError extends GearError {
  name = 'SendMessageError';

  constructor(message?: string) {
    super(message || "Can't send message. Params are invalid");
  }
}

export class SendReplyError extends GearError {
  name = 'SendReplyError';
  constructor(message?: string) {
    super(message || "Can't send reply. Params are invalid");
  }
}
