import { ProgramMetadata } from '@gear-js/api';

import { IMessage, EntryPoint } from '@/entities/message';

const getDecodedMessagePayload = (meta: ProgramMetadata, message: IMessage) => {
  const { entry, payload } = message;
  const isMessageQueued = message.type === 'MessageQueued';

  let type: number | null;

  switch (entry) {
    case EntryPoint.Init: {
      type = isMessageQueued ? meta.types.init.input : meta.types.init.output;
      break;
    }

    case EntryPoint.Reply: {
      type = meta.types.reply;
      break;
    }

    case EntryPoint.Handle: {
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
