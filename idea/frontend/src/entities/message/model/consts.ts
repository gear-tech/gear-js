enum Type {
  MessageEnqueued = 'MessageEnqueued',
  UserMessageSent = 'UserMessageSent',

  // TODO: db entity has only MessageEnqueued and UserMessageSent values,
  // do we need the rest?

  // CodeChanged = 'CodeChanged',
  // DatabaseWiped = 'DatabaseWiped',
  // ProgramChanged = 'ProgramChanged',
  // UserMessageRead = 'UserMessageRead',
  // MessagesDispatched = 'MessagesDispatched',
}

enum ReadReason {
  OutOfRent = 'OutOfRent',
  Claimed = 'Claimed',
  Replied = 'Replied',
}

enum EntryPoint {
  Init = 'init',
  Handle = 'handle',
  Reply = 'reply',
}

export { Type, EntryPoint, ReadReason };
