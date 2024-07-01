import { z } from 'zod';

import { Values } from '../types';
import { Program } from './sails';

const DNS_API_URL = import.meta.env.VITE_DNS_API_URL as string;

const DNS_PROGRAM_QUERY_KEY = ['dnsProgram'];

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

export { DNS_API_URL, DNS_PROGRAM_QUERY_KEY, FIELD_NAME, DEFAULT_VALUES, NAME_SCHEMA, Program };
