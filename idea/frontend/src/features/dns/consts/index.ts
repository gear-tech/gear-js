import { z } from 'zod';

import { Values } from '../types';
import { Program } from './sails';

const DNS_API_URL = import.meta.env.VITE_DNS_API_URL as string;

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
} as const;

export { DNS_API_URL, FIELD_NAME, DEFAULT_VALUES, NAME_SCHEMA, FUNCTION_NAME, Program };
