import { ProgramMetadata } from '@gear-js/api';

import { isNullOrUndefined } from '@/shared/helpers';

import { MESSAGE_ENTRY_POINT, MESSAGE_TYPE } from './consts';
import { Message } from './types';

const getDecodedMessagePayload = (message: Message, meta: ProgramMetadata) => {
  const { entry, payload, type } = message;
  const isMessageQueued = type === MESSAGE_TYPE.MESSAGE_QUEUED;

  let typeIndex: number | null;

  switch (entry) {
    case MESSAGE_ENTRY_POINT.INIT: {
      typeIndex = isMessageQueued ? meta.types.init.input : meta.types.init.output;
      break;
    }

    case MESSAGE_ENTRY_POINT.REPLY: {
      typeIndex = meta.types.reply;
      break;
    }

    case MESSAGE_ENTRY_POINT.HANDLE: {
      typeIndex = isMessageQueued ? meta.types.handle.input : meta.types.handle.output;
      break;
    }

    default:
      typeIndex = isMessageQueued ? meta.types.others.input : meta.types.others.output;
      break;
  }

  return isNullOrUndefined(typeIndex) ? payload : meta.createType(typeIndex, payload);
};

export { getDecodedMessagePayload };
