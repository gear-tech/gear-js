import { KafkaMessage } from 'kafkajs';
import { JSONRPC_ERRORS } from '@gear-js/common';

import { transferService } from '../services/transfer/transfer.service';
import { gearService } from '../gear';
import { kafkaProducer } from '../kafka/producer';
import { testBalanceLogger } from './test-balace.logger';

export async function transferBalanceProcess(message: KafkaMessage, payload: any): Promise<void> {
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

  const topic = message.headers.kafka_replyTopic.toString();
  const correlationId = message.headers.kafka_correlationId.toString();

  await kafkaProducer.send(topic, JSON.stringify(result), correlationId);
}
