import { RMQExchange, RMQQueue, RMQServiceAction, RMQServices } from '@gear-js/common';

import { mainChannelAMQP } from './rmq';

function sendGenesis(genesis: string): void {
  const messageBuff = JSON.stringify({ service: RMQServices.TEST_BALANCE, action: RMQServiceAction.ADD, genesis });
  mainChannelAMQP.publish(RMQExchange.DIRECT_EX, RMQQueue.GENESISES, Buffer.from(messageBuff));
}

function sendDeleteGenesis(genesis: string): void {
  const messageBuff = JSON.stringify({ service: RMQServices.TEST_BALANCE, action: RMQServiceAction.DELETE, genesis });
  mainChannelAMQP.publish(RMQExchange.DIRECT_EX, RMQQueue.GENESISES, Buffer.from(messageBuff));
}

function sendMessage(exchange: RMQExchange, queue: RMQQueue, correlationId: string, params: any): void {
  const messageBuff = JSON.stringify(params);
  mainChannelAMQP.publish(exchange, queue, Buffer.from(messageBuff), {
    correlationId,
  });
}

export const producer = { sendGenesis, sendMessage, sendDeleteGenesis };
