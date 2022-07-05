import { Metadata, CreateType } from '@gear-js/api';

import { MessageModel } from 'types/message';

export const getDecodedMessagePayload = (meta: Metadata, message: MessageModel) => {
  const { entry, payload } = message;

  let type: string | undefined;

  switch (entry) {
    case 'Init': {
      type = meta.init_output;
      break;
    }
    case 'Reply': {
      type = meta.async_handle_output;
      break;
    }
    default: {
      type = meta.handle_output;
    }
  }

  if (!type) {
    return payload;
  }

  return CreateType.create(type, payload, meta);
};
