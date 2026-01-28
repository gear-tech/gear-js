import { Sails } from 'sails-js';

// TODO: import from sails-js
type ISailsFuncArg = InstanceType<typeof Sails>['services'][string]['functions'][string]['args'][number];

export type { ISailsFuncArg };
