enum MESSAGE_TYPE {
  USER_MESS_SENT = 'UserMessageSent',
  ENQUEUED = 'Enqueued',
}

enum MESSAGE_READ_STATUS {
  OUT_OF_RENT = 'OutOfRent',
  CLAIMED = 'Claimed',
  REPLIED = 'Replied',
}

export { MESSAGE_TYPE, MESSAGE_READ_STATUS };
