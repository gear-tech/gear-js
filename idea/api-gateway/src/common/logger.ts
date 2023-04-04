import { getLogger } from '@gear-js/common';

const API_GATEWAY = process.env.NODE_ENV === 'dev' ? 'API_GATEWAY' : '';

export const logger = getLogger(API_GATEWAY);
