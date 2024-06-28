const MESSAGE_TYPE = {
  MESSAGE_QUEUED: 'MessageQueued',
  USER_MESSAGE_SENT: 'UserMessageSent',
} as const;

const MESSAGE_READ_REASON = {
  OUT_OF_RENT: 'OutOfRent',
  CLAIMED: 'Claimed',
  REPLIED: 'Replied',
} as const;

const MESSAGE_ENTRY_POINT = {
  INIT: 'init',
  HANDLE: 'handle',
  REPLY: 'reply',
} as const;

export { MESSAGE_TYPE, MESSAGE_READ_REASON, MESSAGE_ENTRY_POINT };
