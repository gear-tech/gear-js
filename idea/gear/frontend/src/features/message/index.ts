import { useMessageToProgram, useMessageFromProgram } from './api';
import { MESSAGE_TYPE } from './consts';
import { Message } from './types';
import { ProgramMessages } from './ui';
import { isMessageFromProgramWithError, isMessageWithError, getDecodedMessagePayload } from './utils';

export {
  useMessageToProgram,
  useMessageFromProgram,
  isMessageFromProgramWithError,
  isMessageWithError,
  getDecodedMessagePayload,
  ProgramMessages,
  MESSAGE_TYPE,
};

export type { Message };
