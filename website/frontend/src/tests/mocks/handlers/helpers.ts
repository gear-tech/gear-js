import {
  META,
  META_FILE,
  PROGRAM_ID_1,
  PROGRAM_ID_2,
  PROGRAM_ID_3,
  PROGRAM_ID_4,
  MESSAGE_ID_1,
  PROGRAM_WITH_META,
  PROGRAM_WITHOUT_META,
  PROGRAM_WITH_REPLY_META,
  PROGRAM_WITHOUT_REPLY_META,
} from '../../const';

import { RPCResponse } from 'services/ServerRPCRequestService';
import { GetMetaResponse } from 'types/api';
import { MessageModel } from 'types/message';
import { ProgramModel } from 'types/program';

export const getApiResponse = <T>(data: T): RPCResponse<T> => ({
  id: 1,
  jsonrpc: '2.0',
  result: data,
});

export const getMessageResponse = (messageId: string) =>
  getApiResponse<MessageModel>({
    id: messageId,
    entry: null,
    value: '',
    source: messageId === MESSAGE_ID_1 ? PROGRAM_ID_3 : PROGRAM_ID_4,
    payload: '0x4e6f7420656e6f7567682067617320666f7220696e697469616c206d656d6f72792068616e646c696e67',
    exitCode: null,
    timestamp: '2022-06-29T09:54:04.000Z',
    expiration: null,
    destination: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
    replyToMessageId: null,
    processedWithPanic: false,
  });

export const getProgramResponse = (programId: string) => {
  let response: ProgramModel;

  switch (programId) {
    case PROGRAM_ID_1: {
      response = PROGRAM_WITH_META;
      break;
    }
    case PROGRAM_ID_2: {
      response = PROGRAM_WITHOUT_META;
      break;
    }
    case PROGRAM_ID_3: {
      response = PROGRAM_WITH_REPLY_META;
      break;
    }
    case PROGRAM_ID_4: {
      response = PROGRAM_WITHOUT_REPLY_META;
      break;
    }
    default: {
      response = PROGRAM_WITH_META;
    }
  }

  return getApiResponse<ProgramModel>({ ...response });
};

export const getMetadataResponse = (programId: string) =>
  getApiResponse<GetMetaResponse>({
    meta: JSON.stringify(
      programId === PROGRAM_ID_1
        ? META
        : {
            ...META,
            meta_state_input: '',
          }
    ),
    program: '',
    metaFile: META_FILE,
  });
