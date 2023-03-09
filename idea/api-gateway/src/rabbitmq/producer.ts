import { IMessageDataStorageParams, IMessageTestBalanceParams } from './types';
import { AMQP_METHODS, RabbitMQExchanges } from '@gear-js/common';

import { dataStorageChannels, mainChannelAMQP, testBalanceChannels } from './init-rabbitmq';

async function sendMessageToDataStorage(messageNetworkDSParams: IMessageDataStorageParams): Promise<void> {
  const { genesis, params, correlationId, method } = messageNetworkDSParams;

  const channel = dataStorageChannels.get(genesis);

  channel.publish(RabbitMQExchanges.DIRECT_EX, `ds.${genesis}`, Buffer.from(JSON.stringify(params)), {
    correlationId,
    headers: { method },
  });
}

async function sendMessageToTestBalance(messageTestBalanceParams: IMessageTestBalanceParams): Promise<void> {
  const { genesis, params, correlationId, method } = messageTestBalanceParams;

  const channel = testBalanceChannels.get(genesis);

  channel.publish(RabbitMQExchanges.DIRECT_EX, `tb.${genesis}`, Buffer.from(JSON.stringify(params)), {
    correlationId,
    headers: { method },
  });
}

async function sendMessageTBGenesises(): Promise<void> {
  mainChannelAMQP.publish(RabbitMQExchanges.TOPIC_EX, 'tb.genesises', Buffer.from(''), {
    headers: { method: AMQP_METHODS.TEST_BALANCE_GENESISES },
  });
}

async function sendMessageDSGenesises(): Promise<void> {
  mainChannelAMQP.publish(RabbitMQExchanges.TOPIC_EX, 'ds.genesises', Buffer.from(''), {
    headers: { method: AMQP_METHODS.DATA_STORAGE_GENESISES },
  });
}

export const producer = {
  sendMessageToDataStorage,
  sendMessageToTestBalance,
  sendMessageTBGenesises,
  sendMessageDSGenesises,
};
