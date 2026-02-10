import { Hex, hexToBytes } from 'viem';

export const enum EReplyCode {
  Success = 0,
  Error = 1,
}

export const enum ESuccessReply {
  Auto = 0,
  Manual = 1,
}

const enum EErrorReplyReason {
  Execution = 0,
  UnavailableActor = 2,
  RemovedFromWaitlist = 3,
}

export const enum ESimpleExecutionError {
  RanOutOfGas = 0,
  MemoryOverflow = 1,
  BackendError = 2,
  UserspacePanic = 3,
  UnreachableInstruction = 4,
  StackLimitExceeded = 5,
}

export const enum ESimpleUnavailableActorError {
  ProgramExited = 0,
  InitializationFailure = 1,
  Uninitialized = 2,
  ProgramNotCreated = 3,
  ReinstrumentationFailure = 4,
}

abstract class ReplyCodeDetails {
  constructor(protected _bytes: Uint8Array) {
    if (this._bytes.length !== 4) {
      throw new Error(`Invalid reply code length. Expected 4 bytes received ${this._bytes.length}`);
    }
  }

  abstract get reason(): string;

  protected validateDetailsAccess(expectedReason: number, actualReason: number, reasonTypeName: string): void {
    if (actualReason !== expectedReason) {
      throw new Error(`Cannot access ${reasonTypeName} details. Actual reason does not match.`);
    }
  }
}

export class ReplyCode extends ReplyCodeDetails {
  private constructor(bytes: Uint8Array) {
    super(bytes);
    if (this._bytes[0] === 255) {
      throw new Error('Unsupported message reply code');
    }
  }

  static fromBytes(value: Hex) {
    const bytes = hexToBytes(value);

    return new ReplyCode(bytes);
  }

  toBytes() {
    return Uint8Array.from(this._bytes);
  }

  get isSuccess(): boolean {
    return this._bytes[0] === EReplyCode.Success;
  }

  get isError(): boolean {
    return this._bytes[0] === EReplyCode.Error;
  }

  get asSuccess(): SuccessReply {
    this.validateDetailsAccess(EReplyCode.Success, this._bytes[0], 'Success');
    return new SuccessReply(this._bytes);
  }

  get asError(): ErrorReply {
    this.validateDetailsAccess(EReplyCode.Error, this._bytes[0], 'Error');
    return new ErrorReply(this._bytes);
  }

  get reason(): string {
    return this.isSuccess ? this.asSuccess.reason : this.asError.reason;
  }
}

class SuccessReply extends ReplyCodeDetails {
  get reason(): string {
    switch (this._bytes[1]) {
      case ESuccessReply.Auto: {
        return 'Success reply was created by system automatically.';
      }
      case ESuccessReply.Manual: {
        return 'Success reply was created by actor manually.';
      }
      default: {
        return 'Unsupported';
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

class ErrorReply extends ReplyCodeDetails {
  get reason(): string {
    switch (this._bytes[1]) {
      case EErrorReplyReason.Execution: {
        return `Error reply was created due to underlying execution error. Reason: ${this.asExecution.reason}`;
      }
      case EErrorReplyReason.UnavailableActor: {
        return `Destination actor is unavailable, so it can't process the message. Reason: ${this.asUnavailableActor.reason}`;
      }
      case EErrorReplyReason.RemovedFromWaitlist: {
        return 'Message has died in Waitlist as out of rent one.';
      }
      default: {
        return 'Unsupported reason of error reply.';
      }
    }
  }

  get isExecution(): boolean {
    return this._bytes[1] === EErrorReplyReason.Execution;
  }

  get asExecution(): ExecutionError {
    this.validateDetailsAccess(EErrorReplyReason.Execution, this._bytes[1], 'Execution');
    return new ExecutionError(this._bytes);
  }

  get isUnavailableActor(): boolean {
    return this._bytes[1] === EErrorReplyReason.UnavailableActor;
  }

  get asUnavailableActor(): UnavailableActorError {
    this.validateDetailsAccess(EErrorReplyReason.UnavailableActor, this._bytes[1], 'UnavailableActor');
    return new UnavailableActorError(this._bytes);
  }

  get isRemovedFromWaitlist(): boolean {
    return this._bytes[1] === EErrorReplyReason.RemovedFromWaitlist;
  }
}

class ExecutionError extends ReplyCodeDetails {
  get reason(): string {
    switch (this._bytes[2]) {
      case ESimpleExecutionError.RanOutOfGas: {
        return 'Message ran out of gas while executing.';
      }
      case ESimpleExecutionError.MemoryOverflow: {
        return 'Program has reached memory limit while executing.';
      }
      case ESimpleExecutionError.BackendError: {
        return "Execution failed with backend error that couldn't be caught.";
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
        return 'Unsupported';
      }
    }
  }

  get isRanOutOfGas(): boolean {
    return this._bytes[2] === ESimpleExecutionError.RanOutOfGas;
  }

  get isMemoryOverflow(): boolean {
    return this._bytes[2] === ESimpleExecutionError.MemoryOverflow;
  }

  get isBackendError(): boolean {
    return this._bytes[2] === ESimpleExecutionError.BackendError;
  }

  get isUserspacePanic(): boolean {
    return this._bytes[2] === ESimpleExecutionError.UserspacePanic;
  }

  get isUnreachableInstruction(): boolean {
    return this._bytes[2] === ESimpleExecutionError.UnreachableInstruction;
  }

  get isStackLimitExceeded(): boolean {
    return this._bytes[2] === ESimpleExecutionError.StackLimitExceeded;
  }
}

class UnavailableActorError extends ReplyCodeDetails {
  get reason(): string {
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
        return 'Unsupported error reason';
      }
    }
  }

  get isProgramExited(): boolean {
    return this._bytes[2] === ESimpleUnavailableActorError.ProgramExited;
  }

  get isInitializationFailure(): boolean {
    return this._bytes[2] === ESimpleUnavailableActorError.InitializationFailure;
  }

  get isUninitialized(): boolean {
    return this._bytes[2] === ESimpleUnavailableActorError.Uninitialized;
  }

  get isProgramNotCreated(): boolean {
    return this._bytes[2] === ESimpleUnavailableActorError.ProgramNotCreated;
  }

  get isReinstrumentationFailure(): boolean {
    return this._bytes[2] === ESimpleUnavailableActorError.ReinstrumentationFailure;
  }
}

export type { SuccessReply, ErrorReply, ExecutionError, UnavailableActorError };
