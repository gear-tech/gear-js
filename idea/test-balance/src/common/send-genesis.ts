import { RabbitMQueues } from '@gear-js/common';

import { gearService } from '../gear';
import { IRMQMessage } from '../rabbitmq/types';
import { rabbitMQ } from '../rabbitmq/init-rabbitmq';

export async function sendGenesis(): Promise<void> {
  const genesisHash = gearService.getGenesisHash();
  const rmqMessage: IRMQMessage = { genesis: genesisHash, action: 'add', service: 'tb', params: null };
  rabbitMQ.mainChannel.sendToQueue(RabbitMQueues.GENESISES, Buffer.from(JSON.stringify(rmqMessage)));
}
