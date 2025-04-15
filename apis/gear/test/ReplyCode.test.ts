import { ReplyCode } from '../src';

const SPEC_VERSION = 1800;

describe('ReplyCode', () => {
  test('success reply', () => {
    let replyCode = new ReplyCode(new Uint8Array([0, 0, 0, 0]), SPEC_VERSION);

    expect(replyCode.isSuccess).toBeTruthy();
    expect(replyCode.successReason.isAuto).toBeTruthy();
    expect(replyCode.isError).toBeFalsy();
    expect(() => replyCode.errorReason).toThrow('Invalid byte sequence');

    replyCode = new ReplyCode(new Uint8Array([0, 1, 0, 0]), SPEC_VERSION);

    expect(replyCode.isSuccess).toBeTruthy();
    expect(replyCode.successReason.isManual).toBeTruthy();
    expect(replyCode.isError).toBeFalsy();
    expect(() => replyCode.errorReason).toThrow('Invalid byte sequence');
  });

  test('execution error reply', () => {
    let replyCode = new ReplyCode(new Uint8Array([1, 0, 0, 0]), SPEC_VERSION);

    expect(replyCode.isError).toBeTruthy();
    expect(replyCode.isSuccess).toBeFalsy();
    expect(replyCode.errorReason.isExecution).toBeTruthy();
    expect(replyCode.errorReason.isUnavailableActor).toBeFalsy();
    expect(replyCode.errorReason.executionReason.isRanOutOfGas).toBeTruthy();
    expect(() => replyCode.successReason).toThrow('Invalid byte sequence');
    expect(() => replyCode.errorReason.unavailableActorReason).toThrow('Invalid byte sequence');

    replyCode = new ReplyCode(new Uint8Array([1, 0, 1, 0]), SPEC_VERSION);

    expect(replyCode.isError).toBeTruthy();
    expect(replyCode.isSuccess).toBeFalsy();
    expect(replyCode.errorReason.isExecution).toBeTruthy();
    expect(replyCode.errorReason.executionReason.isMemoryOverflow).toBeTruthy();
  });

  test('unavailable actor error reply', () => {
    const replyCode = new ReplyCode(new Uint8Array([1, 2, 0, 0]), SPEC_VERSION);

    expect(replyCode.isError).toBeTruthy();
    expect(replyCode.isSuccess).toBeFalsy();
    expect(replyCode.errorReason.isUnavailableActor).toBeTruthy();
    expect(replyCode.errorReason.unavailableActorReason.isProgramExited).toBeTruthy();
    expect(() => replyCode.errorReason.executionReason).toThrow('Invalid byte sequence');
  });
});
