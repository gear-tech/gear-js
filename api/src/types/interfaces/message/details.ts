import { Enum, Null, Struct } from '@polkadot/types';

import { MessageId } from '../ids';

export interface SimpleExecutionError extends Enum {
  isRentOutOfGas: boolean;
  asRentOutOfGas: Null;
  isMemoryOverflow: boolean;
  asMemoryOverflow: Null;
  isBackendError: boolean;
  asBackendError: Null;
  isUserspacePanic: boolean;
  asUserspacePanic: Null;
  isUnreachableInstruction: boolean;
  asUnreachableInstruction: Null;
  isUnsupported: boolean;
  asUnsupported: Null;
}

export interface SimpleProgramCreationError extends Enum {
  isCodeNotExists: boolean;
  asCodeNotExists: Null;
  isUnsupported: boolean;
  asUnsupported: Null;
}

export interface ErrorReplyReason extends Enum {
  isExecution: boolean;
  asExecution: SimpleExecutionError;
  isFailedToCreateProgram: boolean;
  asFailedToCreateProgram: SimpleProgramCreationError;
  isInactiveProgram: boolean;
  asInactiveProgram: Null;
  isRemovedFromWaitlist: boolean;
  asRemovedFromWaitlist: Null;
  isUnsupported: boolean;
  asUnsupported: Null;
}

export interface SuccessReplyReason extends Enum {
  isAuto: boolean;
  asAuto: Null;
  isManual: boolean;
  asManual: Null;
  isUnsupported: boolean;
  asUnsupported: Null;
}

export interface ReplyCode extends Enum {
  isSuccess: boolean;
  asSuccess: SuccessReplyReason;
  isError: boolean;
  asError: ErrorReplyReason;
  isUnsupported: boolean;
  asUnsupported: Null;
}

export interface ReplyDetails extends Struct {
  to: MessageId;
  code: ReplyCode;
}
