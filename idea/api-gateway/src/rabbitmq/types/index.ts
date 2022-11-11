import {
  AddMetaParams,
  API_METHODS,
  FindMessageParams,
  FindProgramParams,
  GetAllProgramsParams, GetAllUserProgramsParams, GetCodeParams,
  GetIncomingMessagesParams,
  GetMessagesParams,
  GetMetaParams,
  GetOutgoingMessagesParams,
  GetTestBalanceParams,
} from '@gear-js/common';

export type Params =
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
  | GetCodeParams

interface IMessageNetworkDSParams {
  genesis: string;
  method: API_METHODS;
  params: Record<string, any> | Params | string
  correlationId: string;
}

interface IMessageTestBalanceParams {
  genesis: string;
  params: any;
  correlationId: string;
  method: API_METHODS;
}

export { IMessageNetworkDSParams, IMessageTestBalanceParams };
