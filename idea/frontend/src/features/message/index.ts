import { useMessageToProgram, useMessageFromProgram } from './api';
import { isMessageWithError, getDecodedMessagePayload } from './utils';
import { ProgramMessages } from './ui';
import { MESSAGE_TYPE } from './consts';
import { Message } from './types';

export {
  useMessageToProgram,
  useMessageFromProgram,
  isMessageWithError,
  getDecodedMessagePayload,
  ProgramMessages,
  MESSAGE_TYPE,
};

export type { Message };
