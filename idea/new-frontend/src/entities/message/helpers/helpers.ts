import { Metadata, CreateType } from '@gear-js/api';

import { IMessage, EntryPoint } from 'entities/message';

const getDecodedMessagePayload = (meta: Metadata, message: IMessage) => {
  const { entry, payload } = message;
  const isMessageEnqueued = message.type === 'MessageEnqueued';

  let type = isMessageEnqueued ? meta.handle_input : meta.handle_output;

  switch (entry) {
    case EntryPoint.Init: {
      type = isMessageEnqueued ? meta.init_input : meta.init_output;
      break;
    }

    case EntryPoint.Reply: {
      type = isMessageEnqueued ? meta.async_handle_input : meta.async_handle_output;
      break;
    }

    case EntryPoint.Handle: {
      type = isMessageEnqueued ? meta.handle_input : meta.handle_output;
      break;
    }

    default:
      break;
  }

  if (!type) return payload;

  return CreateType.create(type, payload, meta);
};

export { getDecodedMessagePayload };
