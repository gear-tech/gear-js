import { Sails } from 'sails-js';

// TODO: import from sails-js
type ISailsFuncArg = InstanceType<typeof Sails>['services'][string]['functions'][string]['args'][number];
type TypeDef = ReturnType<InstanceType<typeof Sails>['getTypeDef']>;

export type { ISailsFuncArg, TypeDef };
