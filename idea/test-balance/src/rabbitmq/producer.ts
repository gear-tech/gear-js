import { RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';

import { mainChannelAMQP } from './init-rabbitmq';

function sendGenesis(genesis: string): void {
  const messageBuff = JSON.stringify({ service: 'tb', action: 'add', genesis });
  mainChannelAMQP.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(messageBuff));
}

function sendDeleteGenesis(genesis: string): void {
  const messageBuff = JSON.stringify({ service: 'tb', action: 'delete', genesis });
  mainChannelAMQP.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(messageBuff));
}

function sendMessage(exchange: RabbitMQExchanges, queue: RabbitMQueues, correlationId: string, params: any): void {
  const messageBuff = JSON.stringify(params);
  mainChannelAMQP.publish(exchange, queue, Buffer.from(messageBuff), {
    correlationId,
  });
}

export const producer = { sendGenesis, sendMessage, sendDeleteGenesis };
