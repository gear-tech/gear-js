import type { ParsedSails } from '@gear-js/react-hooks';
import type { Sails, SailsProgram } from 'sails-js';

type Ctors = NonNullable<SailsProgram['ctors']> | Sails['ctors'];
type Services = SailsProgram['services'] | Sails['services'];

type SailsService = Services[string];
type Functions = SailsService[keyof SailsService];
type ISailsCtorFuncParams = NonNullable<SailsProgram['ctors']>[string] | Sails['ctors'][string];
type SailsServiceFunc = SailsService['functions'][string];
type SailsServiceQuery = SailsService['queries'][string];
type SailsServiceEvent = SailsService['events'][string];

export type {
  Ctors,
  Functions,
  ISailsCtorFuncParams,
  ParsedSails,
  SailsService,
  SailsServiceEvent,
  SailsServiceFunc,
  SailsServiceQuery,
  Services,
};
