import { RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';

import { mainChannelAMQP } from './init-rabbitmq';

function sendMessage(exchange: RabbitMQExchanges, queue: RabbitMQueues, correlationId: string, params: any): void {
  const messageBuff = JSON.stringify(params);
  mainChannelAMQP.publish(exchange, queue, Buffer.from(messageBuff), { correlationId });
}

export const producer = { sendMessage };
