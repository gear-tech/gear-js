import {
  PROGRAM_ID_1,
  PROGRAM_ID_2,
  PROGRAM_WITH_META,
  PROGRAM_WITHOUT_META,
  MESSAGE_ID_1,
  META_FILE,
  META,
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
    source: messageId === MESSAGE_ID_1 ? PROGRAM_ID_1 : PROGRAM_ID_2,
    payload: '0x4e6f7420656e6f7567682067617320666f7220696e697469616c206d656d6f72792068616e646c696e67',
    exitCode: null,
    timestamp: '2022-06-29T09:54:04.000Z',
    expiration: null,
    destination: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
    replyToMessageId: null,
    processedWithPanic: false,
  });

export const getProgramResponse = (programId: string) =>
  getApiResponse<ProgramModel>({
    ...(programId === PROGRAM_ID_1 ? PROGRAM_WITH_META : PROGRAM_WITHOUT_META),
  });

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
