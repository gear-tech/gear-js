import { KAFKA_TOPICS } from '@gear-js/common';

const API_JSON_RPC_METHODS = {
  ...KAFKA_TOPICS,
  TEST_BALANCE_AVAILABLE: 'testBalance.available'
};

export { API_JSON_RPC_METHODS };
