import { JSONRPC_ERRORS, RabbitMQueues } from '@gear-js/common';

import { transferService } from '../services/transfer.service';
import { gearService } from '../gear';
import { testBalanceLogger } from './test-balace.logger';
import { producer } from '../rabbitmq/producer';

export async function transferBalanceProcess(payload: any, correlationId: string): Promise<void> {
  let result;

  try {
    const isPossibleToTransfer = await transferService.isPossibleToTransfer(payload.address, payload.genesis);
    if (isPossibleToTransfer) {
      const transferBalance = await gearService.transferBalance(payload.address);
      result = { result: transferBalance };
    } else {
      result = { error: JSONRPC_ERRORS.TransferLimitReached.name };
    }
  } catch (error) {
    testBalanceLogger.error(error.message, error.stack);
    result = { error: JSONRPC_ERRORS.InternalError.name };
  }
  await producer.sendMessageToQueue(RabbitMQueues.REPLIES, correlationId, result);
}
