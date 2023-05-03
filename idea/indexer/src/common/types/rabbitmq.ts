import {
  AddMetaParams,
  FindMessageParams,
  FindProgramParams,
  GetAllCodeParams,
  GetAllProgramsParams,
  GetCodeParams,
  GetMessagesParams,
  GetMetaParams,
  RMQServiceActions,
} from '@gear-js/common';
import { ExecutionError } from '../errors';

export type RabbitmqMessageParams =
  | FindProgramParams
  | GetAllProgramsParams
  | AddMetaParams
  | GetMetaParams
  | GetMessagesParams
  | FindMessageParams
  | GetAllCodeParams
  | GetCodeParams

export type Result<T> = Promise<T | ExecutionError>;

export type GenesisCb = (action: RMQServiceActions, genesis: string) => void | Promise<void>;
