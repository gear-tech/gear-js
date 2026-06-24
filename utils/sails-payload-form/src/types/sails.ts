import type { Sails, SailsProgram } from 'sails-js';

type ISailsFuncArg =
  | SailsProgram['services'][string]['functions'][string]['args'][number]
  | Sails['services'][string]['functions'][string]['args'][number];

export type { ISailsFuncArg };
