import { useMessageToProgram, useMessageFromProgram } from './api';
import { isMessageFromProgramWithError, isMessageWithError, getDecodedMessagePayload } from './utils';
import { ProgramMessages } from './ui';
import { MESSAGE_TYPE } from './consts';
import { Message } from './types';

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
