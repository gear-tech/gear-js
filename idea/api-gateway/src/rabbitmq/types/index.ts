import {
  AddMetaByProgramParams,
  API_METHODS,
  FindMessageParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllUserProgramsParams,
  GetCodeParams,
  GetIncomingMessagesParams,
  GetMessagesParams,
  GetMetaByProgramParams,
  GetOutgoingMessagesParams,
  GetTestBalanceParams,
} from '@gear-js/common';

export type Params =
  | AddMetaByProgramParams
  | FindMessageParams
  | FindProgramParams
  | GetAllProgramsParams
  | GetIncomingMessagesParams
  | GetMessagesParams
  | GetMetaByProgramParams
  | GetOutgoingMessagesParams
  | GetTestBalanceParams
  | GetAllUserProgramsParams
  | GetCodeParams
  | Record<string, any>
  | string;

interface IMessageDataStorageParams {
  genesis: string;
  method: API_METHODS;
  params: Record<string, any> | Params | string;
  correlationId: string;
}

interface IMessageTestBalanceParams {
  genesis: string;
  params: any;
  correlationId: string;
  method: API_METHODS;
}

export { IMessageDataStorageParams, IMessageTestBalanceParams };
