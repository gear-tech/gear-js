import { getLogger } from '@gear-js/common';

export const TEST_BALANCE = process.env.NODE_ENV === 'dev' ? 'TEST_BALANCE' : '';

export const logger = getLogger(TEST_BALANCE);
