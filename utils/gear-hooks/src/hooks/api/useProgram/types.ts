import { GasLimit, ProgramCreateOptions, ProgramUploadOptions, Value } from '@gear-js/api';
import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

enum Method {
  Transfer = 'Transfer',
  CodeSaved = 'CodeSaved',
  ProgramChanged = 'ProgramChanged',
  UserMessageSent = 'UserMessageSent',
  UserMessageRead = 'UserMessageRead',
  MessageQueued = 'MessageQueued',
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
  onSuccess?: (programId: HexString) => void;
  onError?: () => void;
};

type HandleInitParams = {
  status: string;
  programId: HexString;
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
  programId: HexString;
  callbacks?: Callbacks;
};

type Options = {
  onSuccess?: Callbacks['onSuccess'];
  onError?: Callbacks['onError'];
  value?: Value;
  salt?: HexString;
};

type Code = ProgramUploadOptions['code'];
type CodeId = ProgramCreateOptions['codeId'];

type UseProgram = (initPayload: AnyJson, gasLimit: GasLimit, options?: Options) => Promise<void>;

export { Method, TransactionStatus, ProgramStatus, TransactionName, ProgramError };
export type {
  Callbacks,
  HandleInitParams,
  HandleErrorParams,
  HandleSignStatusParams,
  Options,
  Code,
  CodeId,
  UseProgram,
};
