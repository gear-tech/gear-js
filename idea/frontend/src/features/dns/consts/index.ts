import { z } from 'zod';

import { GENESIS } from '@/shared/config';

import { Values } from '../types';
import { Program } from './sails';

const API_URL = {
  [GENESIS.MAINNET]: import.meta.env.VITE_MAINNET_DNS_API_URL as string,
  [GENESIS.TESTNET]: import.meta.env.VITE_TESTNET_DNS_API_URL as string,
} as const;

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

export { API_URL, FIELD_NAME, DEFAULT_VALUES, NAME_SCHEMA, FUNCTION_NAME, Program };
