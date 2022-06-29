import {
  PROGRAM_ID_WITH_META,
  PROGRAM_ID_WITHOUT_META,
  PROGRAM_WITH_META,
  PROGRAM_WITHOUT_META,
  MESSAGE_ID_FOR_PROGRAM_WITH_META,
} from '../../const';

export const getMessageResponse = (messageId: string) => ({
  result: {
    source: messageId === MESSAGE_ID_FOR_PROGRAM_WITH_META ? PROGRAM_ID_WITH_META : PROGRAM_ID_WITHOUT_META,
    replyError: 'replyError',
  },
});

export const getProgramResponse = (programId: string) => ({
  result: {
    ...(programId === PROGRAM_ID_WITH_META ? PROGRAM_WITH_META : PROGRAM_WITHOUT_META),
  },
});
