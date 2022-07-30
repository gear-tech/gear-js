import {
  AddMetaParams,
  FindMessageParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  GetAllUserProgramsParams,
  GetIncomingMessagesParams,
  GetMessagesParams,
  GetMetaParams,
  GetOutgoingMessagesParams,
  GetTestBalanceParams,
  ProgramDataResult,
} from '@gear-js/common';

export type KafkaParams =
  | AddMetaParams
  | FindMessageParams
  | FindProgramParams
  | GetAllProgramsParams
  | GetIncomingMessagesParams
  | GetMessagesParams
  | GetMetaParams
  | GetOutgoingMessagesParams
  | GetTestBalanceParams
  | GetAllUserProgramsParams
  | GetAllProgramsResult
  | ProgramDataResult;
