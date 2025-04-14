import { u8aToU8a } from '@polkadot/util';
import { HexString } from '../types/index.js';

interface IReplyCodeReason {
  readonly explanation: string;
}

const REPLY_CODE_LENGTH = 4;

function padTo4Bytes(input: Uint8Array) {
  const res = new Uint8Array(4);
  res.set(input, 0);
  return res;
}

function checkAndGetCodeBytes(code: Uint8Array, prevByteValue?: number, prevBytePosition?: number) {
  if (code.length < 4) {
    code = padTo4Bytes(code);
  } else if (code.length > REPLY_CODE_LENGTH) {
    code = code.slice(0, 4);
  }

  if (prevByteValue != null && code[prevBytePosition] !== prevByteValue) {
    throw new Error('Invalid byte sequence');
  }

  return code;
}

export const enum EReplyCode {
  Success = 0,
  Error = 1,
}

/**
 * # Reply Code decoder
 * @param codeBytes reply code
 * @param _specVersion spec version of the Gear runtime
 */
export class ReplyCode {
  private _bytes: Uint8Array;

  constructor(
    codeBytes: Uint8Array | HexString,
    private _specVersion: number,
  ) {
    this._bytes = checkAndGetCodeBytes(u8aToU8a(codeBytes));

    if (this._bytes.length != 4) {
      throw new Error('Invalid message reply code length');
    }

    if (this._bytes[0] === 255) {
      throw new Error('Unsupported message reply code');
    }
  }

  get isSuccess(): boolean {
    return this._bytes[0] === EReplyCode.Success;
  }

  get isError(): boolean {
    return this._bytes[0] === EReplyCode.Error;
  }

  get successReason(): SuccessReplyReason {
    return new SuccessReplyReason(this._bytes);
  }

  get errorReason(): ErrorReplyReason {
    return new ErrorReplyReason(this._bytes, this._specVersion);
  }
}

export const enum ESuccessReply {
  Auto = 0,
  Manual = 1,
}

/**
 * # Success reply reason.
 */
export class SuccessReplyReason implements IReplyCodeReason {
  private _bytes: Uint8Array;

  constructor(bytes: Uint8Array) {
    this._bytes = checkAndGetCodeBytes(bytes, EReplyCode.Success, 0);
  }

  get explanation(): string {
    switch (this._bytes[1]) {
      case ESuccessReply.Auto: {
        return 'Success reply was created by system automatically.';
      }
      case ESuccessReply.Manual: {
        return 'Success reply was created by actor manually.';
      }
      default: {
        throw new Error('Unsupported reason of success reply.');
      }
    }
  }

  get isAuto(): boolean {
    return this._bytes[1] === ESuccessReply.Auto;
  }

  get isManual(): boolean {
    return this._bytes[1] === ESuccessReply.Manual;
  }
}

const enum EErrorReplyReason {
  Execution = 0,
  FailedToCreateProgram = 1,
  UnavailableActor = 2,
  RemovedFromWaitlist = 3,
  ReinstrumentationFailure = 4,
}

/**
 * # Error reply reason
 */
export class ErrorReplyReason implements IReplyCodeReason {
  private _bytes: Uint8Array;

  constructor(
    bytes: Uint8Array,
    private _specVersion: number,
  ) {
    this._bytes = checkAndGetCodeBytes(bytes, EReplyCode.Error, 0);
  }

  private _throwUnsupported() {
    throw new Error('Unsupported reason of error reply.');
  }

  get explanation(): string {
    switch (this._bytes[1]) {
      case EErrorReplyReason.Execution: {
        return 'Error reply was created due to underlying execution error.';
      }
      case EErrorReplyReason.FailedToCreateProgram: {
        if (this._specVersion < 1800) {
          return 'Failed to create program.';
        }
        this._throwUnsupported();
        break;
      }
      case EErrorReplyReason.UnavailableActor: {
        return `Destination actor is unavailable, so it can't process the message.`;
      }
      case EErrorReplyReason.RemovedFromWaitlist: {
        return 'Message has died in Waitlist as out of rent one.';
      }
      case EErrorReplyReason.ReinstrumentationFailure: {
        if (this._specVersion < 1800) {
          return 'Reinstrumentation failed.';
        }
      }
      // falls through
      default: {
        this._throwUnsupported();
      }
    }
  }

  get isExecution(): boolean {
    return this._bytes[1] === EErrorReplyReason.Execution;
  }

  get executionReason(): ExecutionErrorReason {
    return new ExecutionErrorReason(this._bytes);
  }

  /** This option is available only for spec versions before 1800 */
  get isFailedToCreateProgram(): boolean {
    return this._specVersion < 1800 && this._bytes[1] === EErrorReplyReason.FailedToCreateProgram;
  }

  get isUnavailableActor(): boolean {
    return this._bytes[1] === EErrorReplyReason.UnavailableActor;
  }

  get unabailableActorReason(): UnavailableActorErrorReason {
    return new UnavailableActorErrorReason(this._bytes);
  }

  get isRemovedFromWaitlist(): boolean {
    return this._bytes[1] === EErrorReplyReason.RemovedFromWaitlist;
  }

  /** This option is available only for spec versions before 1800 */
  get isReinstrumentationFailure(): boolean {
    return this._specVersion < 1800 && this._bytes[1] === EErrorReplyReason.ReinstrumentationFailure;
  }
}

export const enum ESimpleExecutionError {
  RanOutOfGas = 0,
  MemoryOverflow = 1,
  BackendError = 2,
  UserspacePanic = 3,
  UnreachableInstruction = 4,
  StackLimitExceeded = 5,
}

/**
 * # Execution error reason
 */
export class ExecutionErrorReason implements IReplyCodeReason {
  private _bytes: Uint8Array;

  constructor(bytes: Uint8Array) {
    checkAndGetCodeBytes(bytes, EErrorReplyReason.Execution, 1);
  }

  get explanation(): string {
    switch (this._bytes[2]) {
      case ESimpleExecutionError.RanOutOfGas: {
        return 'Message ran out of gas while executing.';
      }
      case ESimpleExecutionError.MemoryOverflow: {
        return 'Program has reached memory limit while executing.';
      }
      case ESimpleExecutionError.BackendError: {
        return "Execution failed with backend error that couldn't been caught.";
      }
      case ESimpleExecutionError.UserspacePanic: {
        return 'Execution failed with userspace panic.';
      }
      case ESimpleExecutionError.UnreachableInstruction: {
        return 'Execution failed with `unreachable` instruction call.';
      }
      case ESimpleExecutionError.StackLimitExceeded: {
        return 'Program reached stack limit.';
      }
      default: {
        throw new Error('Unsupported reason of execution error');
      }
    }
  }

  get isRanOutOfGas(): boolean {
    return this._bytes[2] == ESimpleExecutionError.RanOutOfGas;
  }

  get isMemoryOverflow(): boolean {
    return this._bytes[2] == ESimpleExecutionError.MemoryOverflow;
  }

  get isBackendError(): boolean {
    return this._bytes[2] == ESimpleExecutionError.BackendError;
  }

  get isUserspacePanic(): boolean {
    return this._bytes[2] == ESimpleExecutionError.UserspacePanic;
  }

  get isUnreachableInstruction(): boolean {
    return this._bytes[2] == ESimpleExecutionError.UnreachableInstruction;
  }

  get isStackLimitExceeded(): boolean {
    return this._bytes[2] == ESimpleExecutionError.StackLimitExceeded;
  }
}

export const enum ESimpleUnavailableActorError {
  ProgramExited = 0,
  InitializationFailure = 1,
  Uninitialized = 2,
  ProgramNotCreated = 3,
  ReinstrumentationFailure = 4,
}

export class UnavailableActorErrorReason implements IReplyCodeReason {
  private _bytes: Uint8Array;

  constructor(bytes: Uint8Array) {
    checkAndGetCodeBytes(bytes, EErrorReplyReason.UnavailableActor, 1);
  }

  private _throwUnsupported() {
    throw new Error('Unsupported reason of inactive actor error.');
  }

  get explanation(): string {
    switch (this._bytes[2]) {
      case ESimpleUnavailableActorError.ProgramExited: {
        return 'Program called `gr_exit` syscall.';
      }
      case ESimpleUnavailableActorError.InitializationFailure: {
        return 'Program was terminated due to failed initialization.';
      }
      case ESimpleUnavailableActorError.Uninitialized: {
        return 'Program is not initialized yet.';
      }
      case ESimpleUnavailableActorError.ProgramNotCreated: {
        return 'Program was not created.';
      }
      case ESimpleUnavailableActorError.ReinstrumentationFailure: {
        return 'Program re-instrumentation failed.';
      }
      default: {
        this._throwUnsupported();
      }
    }
  }

  get isProgramExited(): boolean {
    return this._bytes[2] == ESimpleUnavailableActorError.ProgramExited;
  }

  get isInitializationFailure(): boolean {
    return this._bytes[2] == ESimpleUnavailableActorError.InitializationFailure;
  }

  get isUninitialized(): boolean {
    return this._bytes[2] == ESimpleUnavailableActorError.Uninitialized;
  }

  get isProgramNotCreated(): boolean {
    return this._bytes[2] == ESimpleUnavailableActorError.ProgramNotCreated;
  }

  get isReinstrumentationFailure(): boolean {
    return this._bytes[2] == ESimpleUnavailableActorError.ReinstrumentationFailure;
  }
}
