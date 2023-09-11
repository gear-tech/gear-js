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
  VoucherIssued = 'VoucherIssued',

  // extrinsics
  SendMessage = 'sendMessage',
  SendReply = 'sendReply',
  UploadProgram = 'uploadProgram',
  CreateProgram = 'createProgram',
}

const FILTER_VALUES = {
  [Method.Transfer]: false,
  [Method.CodeChanged]: false,
  [Method.ProgramChanged]: false,
  [Method.UserMessageSent]: false,
  [Method.UserMessageRead]: false,
  [Method.MessageQueued]: false,
  [Method.MessageWaited]: false,
  [Method.MessageWaken]: false,
  [Method.MessagesDispatched]: false,
} as const;

const LOCAL_STORAGE = {
  EVENT_FILTERS: 'event_filters',
};

export { Section, Method, FILTER_VALUES, LOCAL_STORAGE };
