import { Metadata, CreateType } from '@gear-js/api';

import { IMessage, EntryPoint } from 'entities/message';

const getDecodedMessagePayload = (meta: Metadata, message: IMessage) => {
  const { entry, payload } = message;

  let type: string | undefined;

  switch (entry) {
    case EntryPoint.Init: {
      type = meta.init_output;
      break;
    }
    case EntryPoint.Reply: {
      type = meta.async_handle_output;
      break;
    }
    case EntryPoint.Handle: {
      type = meta.handle_output;
      break;
    }
    default:
      break;
  }

  if (!type) {
    return payload;
  }

  return CreateType.create(type, payload, meta);
};

export { getDecodedMessagePayload };
