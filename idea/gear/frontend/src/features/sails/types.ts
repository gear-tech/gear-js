import { Sails } from 'sails-js';

type Ctors = InstanceType<typeof Sails>['ctors'];
type Services = InstanceType<typeof Sails>['services'];

type SailsService = Services[string];
type Functions = SailsService[keyof SailsService];
type ISailsCtorFuncParams = Sails['ctors'][string];
type SailsServiceFunc = SailsService['functions'][string];
type SailsServiceQuery = SailsService['queries'][string];
type SailsServiceEvent = SailsService['events'][string];

export type {
  Ctors,
  Services,
  SailsService,
  Functions,
  ISailsCtorFuncParams,
  SailsServiceFunc,
  SailsServiceQuery,
  SailsServiceEvent,
};
