import { Sails } from 'sails-js';

const SAILS = await Sails.new();

const RESULT = {
  OK: 'ok',
  ERR: 'err',
} as const;

export { SAILS, RESULT };
