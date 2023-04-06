import { RMQServices, RabbitMQExchanges } from '@gear-js/common';

import { indexerChannels, mainChannelAMQP, testBalanceChannels } from './init-rabbitmq';
import { IRMQMessageParams } from './types';

async function sendMsgToIndexer({ genesis, params, correlationId, method }: IRMQMessageParams): Promise<void> {
  const channel = indexerChannels.get(genesis);

  channel.publish(
    RabbitMQExchanges.DIRECT_EX,
    `${RMQServices.INDEXER}.${genesis}`,
    Buffer.from(JSON.stringify(params)),
    {
      correlationId,
      headers: { method },
    },
  );
}

async function sendMsgToTestBalance({ genesis, params, correlationId, method }: IRMQMessageParams): Promise<void> {
  const channel = testBalanceChannels.get(genesis);

  channel.publish(
    RabbitMQExchanges.DIRECT_EX,
    `${RMQServices.TEST_BALANCE}.${genesis}`,
    Buffer.from(JSON.stringify(params)),
    {
      correlationId,
      headers: { method },
    },
  );
}

async function sendMsgTBGenesises(): Promise<void> {
  mainChannelAMQP.publish(RabbitMQExchanges.TOPIC_EX, `${RMQServices.TEST_BALANCE}.genesises`, Buffer.from(''));
}

async function sendMsgIndexerGenesises(): Promise<void> {
  mainChannelAMQP.publish(RabbitMQExchanges.TOPIC_EX, `${RMQServices.INDEXER}.genesises`, Buffer.from(''));
}

export const producer = {
  sendMsgIndexerGenesises,
  sendMsgTBGenesises,
  sendMsgToIndexer,
  sendMsgToTestBalance,
};
