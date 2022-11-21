import { RabbitMQueues } from '@gear-js/common';

import { mainChannelAMQP } from './init-rabbitmq';

async function sendGenesis(queue: RabbitMQueues, genesis: string): Promise<void> {
  const messageBuff = JSON.stringify({ service: 'tb', action: 'add', genesis });
  mainChannelAMQP.sendToQueue(queue, Buffer.from(messageBuff));
}

async function sendDeleteGenesis(queue: RabbitMQueues, genesis: string): Promise<void> {
  const messageBuff = JSON.stringify({ service: 'tb', action: 'delete', genesis });
  mainChannelAMQP.sendToQueue(queue, Buffer.from(messageBuff));
}

async function sendMessageToQueue(queue: RabbitMQueues, correlationId: string, params: any): Promise<void> {
  const messageBuff = JSON.stringify(params);
  mainChannelAMQP.sendToQueue(queue, Buffer.from(messageBuff), { correlationId });
}

export const producer = { sendGenesis, sendMessageToQueue, sendDeleteGenesis };
