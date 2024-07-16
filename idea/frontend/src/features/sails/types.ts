import { Sails } from 'sails-js';

import { RESULT } from './consts';
import { getPayloadSchema } from './utils';

// TODO: import from sails-js
type ISailsFuncArg = InstanceType<typeof Sails>['services'][string]['functions'][string]['args'][number];
type Ctors = InstanceType<typeof Sails>['ctors'];
type Services = InstanceType<typeof Sails>['services'];
type SailsService = Services[string];
type Functions = SailsService[keyof SailsService];

type Result = typeof RESULT[keyof typeof RESULT];
type PayloadValue = string | boolean | null | Array<PayloadValue> | { [key: string]: PayloadValue };
type PayloadValueSchema = ReturnType<typeof getPayloadSchema>;

// no need to export SailsService if
// ISailsCtorFuncParams
// SailsServiceFunc
// SailsServiceQuery
// SailsServiceEvent
// are gonna be exported
export type { ISailsFuncArg, Result, PayloadValue, PayloadValueSchema, Ctors, Services, SailsService, Functions };
