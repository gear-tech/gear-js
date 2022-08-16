import { KafkaMessage } from 'kafkajs';
import { JSONRPC_ERRORS } from '@gear-js/common';

import { testBalanceLogger } from '../common/test-balace.logger';

export async function getPayloadFromMessage(message: KafkaMessage): Promise<{ error: string; payload: any }> {
  const result: { error: string | null; payload: any } = {
    payload: null,
    error: null,
  };
  try {
    result.payload = JSON.parse(message.value.toString());
  } catch (error) {
    testBalanceLogger.error(error.message, error.stack);
    result.error = JSONRPC_ERRORS.InternalError.name;
  }
  return result;
}
