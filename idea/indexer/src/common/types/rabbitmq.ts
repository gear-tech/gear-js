import {
  AddMetaByProgramParams,
  AddMetaByCodeParams,
  FindMessageParams,
  FindProgramParams,
  GetAllCodeParams,
  GetAllProgramsParams,
  GetCodeParams,
  GetMessagesParams,
  GetMetaByProgramParams,
  RMQServiceActions,
} from '@gear-js/common';
import { ExecutionError } from '../errors';

export type RabbitmqMessageParams =
  | FindProgramParams
  | GetAllProgramsParams
  | AddMetaByProgramParams
  | GetMetaByProgramParams
  | GetMessagesParams
  | FindMessageParams
  | GetAllCodeParams
  | GetCodeParams
  | AddMetaByCodeParams;

export type Result<T> = Promise<T | ExecutionError>;

export type GenesisCb = (action: RMQServiceActions, genesis: string) => void | Promise<void>;
