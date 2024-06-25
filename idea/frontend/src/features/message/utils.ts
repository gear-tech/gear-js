import { ProgramMetadata } from '@gear-js/api';

import { MESSAGE_ENTRY_POINT } from './consts';
import { Message } from './types';

const getDecodedMessagePayload = (meta: ProgramMetadata, message: Message) => {
  const { entry, payload } = message;
  const isMessageQueued = message.type === 'MessageQueued';

  let type: number | null;

  switch (entry) {
    case MESSAGE_ENTRY_POINT.INIT: {
      type = isMessageQueued ? meta.types.init.input : meta.types.init.output;
      break;
    }

    case MESSAGE_ENTRY_POINT.REPLY: {
      type = meta.types.reply;
      break;
    }

    case MESSAGE_ENTRY_POINT.HANDLE: {
      type = isMessageQueued ? meta.types.handle.input : meta.types.handle.output;
      break;
    }

    default:
      type = isMessageQueued ? meta.types.others.input : meta.types.others.output;
      break;
  }

  return type !== undefined && type !== null ? meta.createType(type, payload) : payload;
};

export { getDecodedMessagePayload };
