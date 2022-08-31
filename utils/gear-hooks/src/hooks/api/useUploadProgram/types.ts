import { Hex, IProgramUploadOptions, Value } from '@gear-js/api';
import { ISubmittableResult, Signer } from '@polkadot/types/types';

enum Method {
  Transfer = 'Transfer',
  CodeSaved = 'CodeSaved',
  ProgramChanged = 'ProgramChanged',
  UserMessageSent = 'UserMessageSent',
  UserMessageRead = 'UserMessageRead',
  MessageEnqueued = 'MessageEnqueued',
  MessagesDispatched = 'MessagesDispatched',
  ExtrinsicFailed = 'ExtrinsicFailed',
  ExtrinsicSuccess = 'ExtrinsicSuccess',
}

enum TransactionStatus {
  Ready = 'Ready',
  InBlock = 'InBlock',
  IsInvalid = 'IsInvalid',
  Finalized = 'Finalized',
}

enum ProgramStatus {
  Success = 'success',
  Failed = 'failed',
  InProgress = 'in progress',
}

enum TransactionName {
  SendReply = 'gear.sendReply',
  SendMessage = 'gear.sendMessage',
  ClaimMessage = 'gear.claimValueFromMailbox',
  SubmitCode = 'gear.submitCode',
  CreateProgram = 'gear.createProgram',
  UploadProgram = 'gear.uploadProgram',
}

enum ProgramError {
  Unauthorized = 'Unauthorized',
  InvalidParams = 'Invalid method parameters',
  InvalidTransaction = 'Transaction error. Status: isInvalid',
  InitFail = 'Program initialization failed',
  NodeError = 'Gear node error',
  LowBalance = 'Invalid transaction. Account balance too low',
  PayloadError = 'payload.toHex is not a function',
}

type Callbacks = {
  onSuccess?: (programId: Hex) => void;
  onError?: () => void;
};

type SingAndSendParams = {
  address: string;
  signer: Signer;
  alertId: string;
  programId: Hex;
  callbacks?: Callbacks;
};

type HandleInitParams = {
  status: string;
  programId: Hex;
  onError?: () => void;
};

type HandleErrorParams = {
  message: string;
  alertId: string;
  onError?: () => void;
};

type HandleSignStatusParams = {
  result: ISubmittableResult;
  alertId: string;
  programId: Hex;
  callbacks?: Callbacks;
};

type UploadOptions = {
  onSuccess?: Callbacks['onSuccess'];
  onError?: Callbacks['onError'];
  value?: Value;
  salt?: Hex;
};

type Code = IProgramUploadOptions['code'];

export { Method, TransactionStatus, ProgramStatus, TransactionName, ProgramError };
export type {
  Callbacks,
  SingAndSendParams,
  HandleInitParams,
  HandleErrorParams,
  HandleSignStatusParams,
  UploadOptions,
  Code,
};
