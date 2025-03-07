import { Sails } from 'sails-js';

// TODO: import from sails-js
type ISailsFuncArg = InstanceType<typeof Sails>['services'][string]['functions'][string]['args'][number];
type Ctors = InstanceType<typeof Sails>['ctors'];
type Services = InstanceType<typeof Sails>['services'];

type SailsService = Services[string];
type Functions = SailsService[keyof SailsService];
type ISailsCtorFuncParams = Sails['ctors'][string];
type SailsServiceFunc = SailsService['functions'][string];
type SailsServiceQuery = SailsService['queries'][string];
type SailsServiceEvent = SailsService['events'][string];

type PayloadValue = string | boolean | null | Array<PayloadValue> | { [key: string]: PayloadValue };

export type {
  ISailsFuncArg,
  PayloadValue,
  Ctors,
  Services,
  Functions,
  ISailsCtorFuncParams,
  SailsService,
  SailsServiceFunc,
  SailsServiceQuery,
  SailsServiceEvent,
};
