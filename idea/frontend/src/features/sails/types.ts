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
type PayloadValue = string | null | Array<PayloadValue> | { [key: string]: PayloadValue };
type PayloadValueSchema = ReturnType<typeof getPayloadSchema>;

export type { ISailsFuncArg, Result, PayloadValue, PayloadValueSchema, Ctors, Services, Functions };
