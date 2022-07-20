export class SendMessageError extends Error {
  name = 'SendMessageError';

  constructor(message?: string) {
    super(message || 'Can\'t send message. Params are invalid');
  }
}

export class SendReplyError extends Error {
  name = 'SendReplyError';
  constructor(message?: string) {
    super(message || 'Can\'t send reply. Params are invalid');
  }
}
