import { u8aToHex } from '@polkadot/util';

export interface IReplyCode {
  __kind: 'Success' | 'Error' | 'Unsupported';
  value: VSuccessReplyReason | VErrorReplyReason | VErrorReplyReason1800;
}

export type VSuccessReplyReason = { __kind: 'Auto' | 'Manual' };

export type VErrorReplyReason =
  | { __kind: 'Execution'; value: VSimpleExecutionReason }
  | { __kind: 'FailedToCreateProgram'; value: VSimpleProgramCreationError }
  | { __kind: 'InactiveActor'; value: undefined }
  | { __kind: 'RemovedFromWaitlist'; value: undefined }
  | { __kind: 'ReinstrumentationFailure'; value: undefined };

export type VErrorReplyReason1800 =
  | { __kind: 'Execution'; value: VSimpleExecutionReason }
  | { __kind: 'UnavailableActor'; value: VSimpleUnavailableActorError }
  | { __kind: 'RemovedFromWaitlist'; value: undefined };

export type VSimpleUnavailableActorError =
  | { __kind: 'ProgramExited' }
  | { __kind: 'InitializationFailure' }
  | { __kind: 'Uninitialized' }
  | { __kind: 'ProgramNotCreated' }
  | { __kind: 'ReinstrumentationFailure' };

export type VSimpleExecutionReason =
  | { __kind: 'RanOutOfGas' }
  | { __kind: 'MemoryOverflow' }
  | { __kind: 'BackendError' }
  | { __kind: 'UserspacePanic' }
  | { __kind: 'UnreachableInstruction' }
  | { __kind: 'StackLimitExceeded' };

export type VSimpleProgramCreationError = { __kind: 'CodeNotExists'; value: undefined };

export class ReplyCode {
  private _bytes: Uint8Array;

  constructor(
    private value: IReplyCode,
    private specVersion: number,
  ) {
    this._bytes = new Uint8Array(4);
    this._setFirstByte();
  }

  private _setFirstByte() {
    switch (this.value.__kind) {
      case 'Success': {
        this._bytes[0] = 0;
        return this._setSecondSuccessByte();
      }
      case 'Error': {
        this._bytes[0] = 1;
        if (this.specVersion < 1800) {
          return this._setSecondErrorByte();
        } else {
          return this._setSecondErrorByte1800();
        }
      }
      default: {
        this._unsupportedByte(0);
      }
    }
  }

  private _setSecondSuccessByte() {
    switch (this.value.value.__kind) {
      case 'Auto': {
        this._bytes[1] = 0;
        break;
      }
      case 'Manual': {
        this._bytes[1] = 1;
        break;
      }
      default: {
        this._unsupportedByte(1);
      }
    }
  }

  private _setSecondErrorByte() {
    switch (this.value.value.__kind) {
      case 'Execution': {
        this._bytes[1] = 0;
        return this._setThirdExecutionReasonByte();
      }
      case 'FailedToCreateProgram': {
        this._bytes[1] = 1;
        return this._setThirdFailedToCreateProgramReason();
      }
      case 'InactiveActor': {
        this._bytes[1] = 2;
        break;
      }
      case 'RemovedFromWaitlist': {
        this._bytes[1] = 3;
        break;
      }
      case 'ReinstrumentationFailure': {
        this._bytes[1] = 4;
        break;
      }
      default: {
        this._unsupportedByte(1);
      }
    }
  }

  private _setSecondErrorByte1800() {
    switch ((this.value.value as VErrorReplyReason1800).__kind) {
      case 'Execution': {
        this._bytes[1] = 0;
        return this._setThirdExecutionReasonByte();
      }
      case 'UnavailableActor': {
        this._bytes[1] = 2;
        return this._setThirdUnavailableActorBytes();
      }
      case 'RemovedFromWaitlist': {
        this._bytes[1] = 3;
        break;
      }
      default: {
        this._unsupportedByte(1);
      }
    }
  }

  private _setThirdExecutionReasonByte() {
    const errorReason = this.value.value as VErrorReplyReason;
    switch ((errorReason.value as VSimpleExecutionReason).__kind) {
      case 'RanOutOfGas': {
        this._bytes[2] = 0;
        break;
      }
      case 'MemoryOverflow': {
        this._bytes[2] = 1;
        break;
      }
      case 'BackendError': {
        this._bytes[2] = 2;
        break;
      }
      case 'UserspacePanic': {
        this._bytes[2] = 3;
        break;
      }
      case 'UnreachableInstruction': {
        this._bytes[2] = 4;
        break;
      }
      case 'StackLimitExceeded': {
        this._bytes[2] = 5;
        break;
      }
      default: {
        this._unsupportedByte(2);
      }
    }
  }

  private _setThirdFailedToCreateProgramReason() {
    const errorReason = this.value.value as VErrorReplyReason;
    switch ((errorReason.value as VSimpleProgramCreationError).__kind) {
      case 'CodeNotExists': {
        this._bytes[2] = 0;
        break;
      }
      default: {
        this._unsupportedByte(2);
      }
    }
  }

  private _setThirdUnavailableActorBytes() {
    const error = this.value.value as VErrorReplyReason1800;

    switch ((error.value as VSimpleUnavailableActorError).__kind) {
      case 'ProgramExited': {
        this._bytes[2] = 0;
        break;
      }
      case 'InitializationFailure': {
        this._bytes[2] = 1;
        break;
      }
      case 'Uninitialized': {
        this._bytes[2] = 2;
        break;
      }
      case 'ProgramNotCreated': {
        this._bytes[2] = 3;
        break;
      }
      case 'ReinstrumentationFailure': {
        this._bytes[2] = 4;
        break;
      }
      default: {
        this._unsupportedByte(2);
      }
    }
  }

  private _unsupportedByte(position: 0 | 1 | 2 | 3) {
    this._bytes[position] = 255;
    console.error(`Unsupported byte at position ${position}. Value: ${JSON.stringify(this.value)}`);
  }

  toHex(): string {
    return u8aToHex(this._bytes);
  }
}
