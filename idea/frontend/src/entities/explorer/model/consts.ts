enum Section {
  System = 'system',
}

enum Method {
  Transfer = 'Transfer',
  CodeChanged = 'CodeChanged',
  ProgramChanged = 'ProgramChanged',
  UserMessageSent = 'UserMessageSent',
  UserMessageRead = 'UserMessageRead',
  MessageEnqueued = 'MessageEnqueued',
  MessagesDispatched = 'MessagesDispatched',
  MessageWaited = 'MessageWaited',
  MessageWaken = 'MessageWaken',
  ExtrinsicFailed = 'ExtrinsicFailed',
  ExtrinsicSuccess = 'ExtrinsicSuccess',
}

export { Section, Method };
