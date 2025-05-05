import { HexString, ReplyCode } from '@gear-js/api';

const getReplyErrorReason = (code: HexString | Uint8Array, specVersion: number, userspacePayload: string) => {
  const replyCode = new ReplyCode(code, specVersion);

  if (replyCode.errorReason.executionReason.isUserspacePanic) {
    return userspacePayload;
  }
  if (replyCode.errorReason.isExecution) {
    return replyCode.errorReason.executionReason.explanation;
  }
  return replyCode.errorReason.explanation;
};

export { getReplyErrorReason };
