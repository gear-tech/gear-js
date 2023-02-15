enum Section {
  System = 'system',
}

enum Method {
  Transfer = 'Transfer',
  CodeChanged = 'CodeChanged',
  ProgramChanged = 'ProgramChanged',
  UserMessageSent = 'UserMessageSent',
  UserMessageRead = 'UserMessageRead',
  MessageQueued = 'MessageQueued',
  MessagesDispatched = 'MessagesDispatched',
  MessageWaited = 'MessageWaited',
  MessageWaken = 'MessageWaken',
  ExtrinsicFailed = 'ExtrinsicFailed',
  ExtrinsicSuccess = 'ExtrinsicSuccess',
}

export { Section, Method };
