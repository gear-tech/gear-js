import { ProgramMetadata } from '@gear-js/api';

import { IMessage, EntryPoint } from 'entities/message';

const getDecodedMessagePayload = (meta: ProgramMetadata, message: IMessage) => {
  const { entry, payload } = message;
  const isMessageEnqueued = message.type === 'MessageEnqueued';

  let type: number | undefined;

  switch (entry) {
    case EntryPoint.Init: {
      type = isMessageEnqueued ? meta.types.init.input : meta.types.init.output;
      break;
    }

    case EntryPoint.Reply: {
      type = isMessageEnqueued ? meta.types.reply.input : meta.types.reply.output;
      break;
    }

    case EntryPoint.Handle: {
      type = isMessageEnqueued ? meta.types.handle.input : meta.types.handle.output;
      break;
    }

    default:
      type = isMessageEnqueued ? meta.types.others.input : meta.types.others.output;
      break;
  }

  return type ? meta.createType(type, payload) : payload;
};

export { getDecodedMessagePayload };
