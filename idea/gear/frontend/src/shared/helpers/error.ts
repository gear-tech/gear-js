import { HexString, ReplyCode } from '@gear-js/api';

const getErrorReason = (code: HexString | Uint8Array, specVersion: number, userspacePanicExplanation: string) => {
  const replyCode = new ReplyCode(code, specVersion);

  if (replyCode.errorReason.executionReason.isUserspacePanic) {
    return userspacePanicExplanation;
  }
  if (replyCode.errorReason.isExecution) {
    return replyCode.errorReason.executionReason.explanation;
  }
  return replyCode.errorReason.explanation;
};

export { getErrorReason };
