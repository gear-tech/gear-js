import { IMessageNetworkDSParams, IMessageTestBalanceParams } from './types';
import { RabbitMQExchanges } from '@gear-js/common';
import { dataStorageServicesMap, testBalanceServicesMap } from './init-rabbitmq';

async function sendMessageToDataStorage(messageNetworkDSParams: IMessageNetworkDSParams) {
  const { genesis, params, correlationId, method } = messageNetworkDSParams;

  const channel = dataStorageServicesMap.get(genesis);

  await channel.assertQueue(`ds.${genesis}`, { durable: false, exclusive: true });

  channel.publish(RabbitMQExchanges.DIRECT_EX,
    `ds.${genesis}`,
    Buffer.from(JSON.stringify(params)),
    { correlationId, headers: { method } });
}

async function sendMessageToTestBalance(messageTestBalanceParams: IMessageTestBalanceParams) {
  const { genesis, params, correlationId, method } = messageTestBalanceParams;

  const channel = testBalanceServicesMap.get(genesis);

  await channel.assertQueue(`tb.${genesis}`, { durable: false, exclusive: true });

  channel.publish(RabbitMQExchanges.DIRECT_EX,
    `tb.${genesis}`,
    Buffer.from(JSON.stringify(params)),
    { correlationId, headers: { method } });
}

export const producer = {
  sendMessageToDataStorage,
  sendMessageToTestBalance
};
