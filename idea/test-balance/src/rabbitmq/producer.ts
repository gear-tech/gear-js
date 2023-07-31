import { RMQExchanges, RMQQueues, RMQServiceActions, RMQServices } from '@gear-js/common';

import { mainChannelAMQP } from './init-rabbitmq';

function sendGenesis(genesis: string): void {
  const messageBuff = JSON.stringify({ service: RMQServices.TEST_BALANCE, action: RMQServiceActions.ADD, genesis });
  mainChannelAMQP.publish(RMQExchanges.DIRECT_EX, RMQQueues.GENESISES, Buffer.from(messageBuff));
}

function sendDeleteGenesis(genesis: string): void {
  const messageBuff = JSON.stringify({ service: RMQServices.TEST_BALANCE, action: RMQServiceActions.DELETE, genesis });
  mainChannelAMQP.publish(RMQExchanges.DIRECT_EX, RMQQueues.GENESISES, Buffer.from(messageBuff));
}

function sendMessage(exchange: RMQExchanges, queue: RMQQueues, correlationId: string, params: any): void {
  const messageBuff = JSON.stringify(params);
  mainChannelAMQP.publish(exchange, queue, Buffer.from(messageBuff), {
    correlationId,
  });
}

export const producer = { sendGenesis, sendMessage, sendDeleteGenesis };
