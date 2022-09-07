import { UserMessageReadData } from '@gear-js/api';
import { MessageReadReason } from '@gear-js/common';

function getMessageReadStatus(data: UserMessageReadData): MessageReadReason | null {
  if (data.reason.isSystem && data.reason.asSystem.isOutOfRent) {
    return MessageReadReason.OUT_OF_RENT;
  }
  if (data.reason.isRuntime && data.reason.asRuntime.isMessageClaimed) {
    return MessageReadReason.CLAIMED;
  }
  if (data.reason.isRuntime && data.reason.asRuntime.isMessageReplied) {
    return MessageReadReason.REPLIED;
  }
  return null;
}

export { getMessageReadStatus };
