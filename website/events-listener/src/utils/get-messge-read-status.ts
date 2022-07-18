import { UserMessageReadData } from '@gear-js/api';
import { MESSAGE_READ_STATUS } from '@gear-js/common';

function getMessageReadStatus(data: UserMessageReadData): MESSAGE_READ_STATUS | null {
  if (data.reason.isSystem && data.reason.asSystem.isOutOfRent) {
    return MESSAGE_READ_STATUS.OUT_OF_RENT;
  }
  if (data.reason.isRuntime && data.reason.asRuntime.isMessageClaimed) {
    return MESSAGE_READ_STATUS.CLAIMED;
  }
  if (data.reason.isRuntime && data.reason.asRuntime.isMessageReplied) {
    return MESSAGE_READ_STATUS.REPLIED;
  }
  return null;
}

export { getMessageReadStatus };
