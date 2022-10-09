import { API_METHODS } from '@gear-js/common';

export function isJsonRpcAvailableMethod(method: API_METHODS): boolean {
  return [API_METHODS.TEST_BALANCE_AVAILABLE, API_METHODS.NETWORK_DATA_AVAILABLE].includes(method);
}
