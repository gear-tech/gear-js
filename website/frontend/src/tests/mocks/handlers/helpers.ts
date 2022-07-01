import {
  PROGRAM_ID_WITH_META,
  PROGRAM_ID_WITHOUT_META,
  PROGRAM_WITH_META,
  PROGRAM_WITHOUT_META,
  MESSAGE_ID_FOR_PROGRAM_WITH_META,
} from '../../const';

import { RPCResponse } from 'services/ServerRPCRequestService';
import { MessageModel } from 'types/message';
import { ProgramModel } from 'types/program';

export const getMessageResponse = (messageId: string): RPCResponse<MessageModel> => ({
  id: 1,
  jsonrpc: '2.0',
  result: {
    id: messageId,
    source: messageId === MESSAGE_ID_FOR_PROGRAM_WITH_META ? PROGRAM_ID_WITH_META : PROGRAM_ID_WITHOUT_META,
    destination: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
    payload: '0x4e6f7420656e6f7567682067617320666f7220696e697469616c206d656d6f72792068616e646c696e67',
    replyError: '1',
    timestamp: '2022-06-29T09:54:04.000Z',
  },
});

export const getProgramResponse = (programId: string): RPCResponse<ProgramModel> => ({
  id: 1,
  jsonrpc: '2.0',
  result: {
    ...(programId === PROGRAM_ID_WITH_META ? PROGRAM_WITH_META : PROGRAM_WITHOUT_META),
  },
});
