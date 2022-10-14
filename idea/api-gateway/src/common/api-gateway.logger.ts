import { initLogger } from '@gear-js/common';

const API_GATEWAY = process.env.NODE_ENV === 'dev' ? 'API_GATEWAY' : '';

export const apiGatewayLogger = initLogger(API_GATEWAY);
