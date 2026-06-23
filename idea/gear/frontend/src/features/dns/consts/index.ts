import { z } from 'zod';

import type { Values } from '../types';

import { SailsProgram } from './sails';

const FIELD_NAME = {
  DNS_NAME: 'name',
  DNS_ADDRESS: 'address',
} as const;

const DEFAULT_VALUES: Values = {
  [FIELD_NAME.DNS_ADDRESS]: '',
  [FIELD_NAME.DNS_NAME]: '',
};

const domainNameRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_SCHEMA = z.string().trim().regex(domainNameRegex, 'Invalid domain name');

const FUNCTION_NAME = {
  ADD_PROGRAM: 'addNewProgram',
  CHANGE_PROGRAM_ID: 'changeProgramId',
  DELETE_PROGRAM: 'deleteProgram',
  ADD_ADMIN: 'addAdminToProgram',
  REMOVE_ADMIN: 'removeAdminFromProgram',
} as const;

export { DEFAULT_VALUES, FIELD_NAME, FUNCTION_NAME, NAME_SCHEMA, SailsProgram };
