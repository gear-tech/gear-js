import { KafkaMessage } from 'kafkajs';
import { initLogger, JSONRPC_ERRORS, KAFKA_TOPICS } from '@gear-js/common';

import { transferService } from '../transfer/transfer.service';
import { gearService } from '../../gear';
import { kafkaProducer } from '../../kafka/producer';

const logger = initLogger('genesisHashService');

export const genesisHashService = {
  async sendByPayload(message: KafkaMessage, payload: any): Promise<void> {
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
      logger.error(error.message, error.stack);
      result = { error: JSONRPC_ERRORS.InternalError.name };
    }

    await sendReply(message, JSON.stringify(result));
  },
  async sendGenesis(): Promise<void> {
    const genesisHash = gearService.getGenesisHash();

    await kafkaProducer.send(`${KAFKA_TOPICS.TEST_BALANCE_GENESIS_HASH_API}.reply`, genesisHash);
  },
};

async function sendReply(message: KafkaMessage, value: string): Promise<void> {
  const topic = message.headers.kafka_replyTopic.toString();
  const correlationId = message.headers.kafka_correlationId.toString();

  await kafkaProducer.send(topic, value, correlationId);
}
