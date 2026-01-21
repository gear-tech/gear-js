import { RESULT } from '../consts';
import { getPayloadSchema } from '../utils';

import { FieldProps } from './field-props';
import {
  ISailsFuncArg,
  Ctors,
  Services,
  Functions,
  ISailsCtorFuncParams,
  SailsService,
  SailsServiceFunc,
  SailsServiceQuery,
  SailsServiceEvent,
} from './sails';

type Result = (typeof RESULT)[keyof typeof RESULT];
type PayloadValue = string | boolean | null | Array<PayloadValue> | { [key: string]: PayloadValue };
type PayloadValueSchema = ReturnType<typeof getPayloadSchema>;

export type {
  FieldProps,
  ISailsFuncArg,
  Result,
  PayloadValue,
  PayloadValueSchema,
  Ctors,
  Services,
  Functions,
  ISailsCtorFuncParams,
  SailsService,
  SailsServiceFunc,
  SailsServiceQuery,
  SailsServiceEvent,
};
