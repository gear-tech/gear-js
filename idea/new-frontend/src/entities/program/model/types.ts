enum CodeStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

enum ProgramStatus {
  Unknown = 'unknown',
  Active = 'active',
  Terminated = 'terminated',
  InitFailed = 'init_failed',
  Paused = 'paused',
}

enum MessageReadReason {
  OutOfRent = 'OutOfRent',
  Claimed = 'Claimed',
  Replied = 'Replied',
}

enum MessageEntryPoint {
  Init = 'init',
  Handle = 'handle',
  Reply = 'reply',
}

enum MessageType {
  Sent = 'UserMessageSent',
  Enqueued = 'MessageEnqueued',
}

interface IBase {
  genesis: string;
  blockHash: string | null;
  timestamp: string | null;
}

interface IMeta {
  id: string;
  program: string;
  owner: string;
  code: ICode;
  programs: IProgram[];
  meta: string | null;
  metaWasm: string | null;
}

interface ICode {
  _id: string;
  id: string;
  name: string;
  status: CodeStatus;
  meta: IMeta;
  programs: IProgram[];
  expiration: string | null;
}

interface IMessage {
  id: string;
  destination: string;
  source: string;
  value: string;
  payload: string | null;
  exitCode: number | null;
  replyToMessageId: string | null;
  processedWithPanic: boolean | null;
  entry: MessageEntryPoint | null;
  expiration: number | null;
  type: MessageType | null;
  readReason: MessageReadReason | null;
  program: IProgram | null;
}

interface IProgram extends IBase {
  _id: string;
  id: string;
  owner: string;
  name: string;
  status: ProgramStatus;
  messages: IMessage[];
  title: string | null;
  expiration: number | null;
  code: ICode | null;
  meta: IMeta | null;
}

export type { IProgram };
