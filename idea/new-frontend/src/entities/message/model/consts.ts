enum Entry {
  Init = 'Init',
  Handle = 'Handle',
  Reply = 'Reply',
}

enum Type {
  CodeChanged = 'CodeChanged',
  DatabaseWiped = 'DatabaseWiped',
  ProgramChanged = 'ProgramChanged',
  MessageEnqueued = 'MessageEnqueued',
  UserMessageSent = 'UserMessageSent',
  UserMessageRead = 'UserMessageRead',
  MessagesDispatched = 'MessagesDispatched',
}

enum ReadReason {
  Replied = 'Replied',
  Claimed = 'Claimed',
  OutOfRent = 'OutOfRent',
}

export { Type, Entry, ReadReason };
