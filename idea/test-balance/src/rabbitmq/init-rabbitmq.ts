import { Channel, connect, Connection } from 'amqplib';
import { RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';

import config from '../config/configuration';
import { gearService } from '../gear';
import { directExchangeConsumer } from './consumer';

export let connectionAMQP: Connection;
export let mainChannelAMQP: Channel;

export async function initAMQP(): Promise<void> {
  try {
    connectionAMQP = await connect(config.rabbitmq.url);
    mainChannelAMQP = await connectionAMQP.createChannel();
    await mainChannelAMQP.prefetch(1);
    const exchange = RabbitMQExchanges.DIRECT_EX;
    const genesis = gearService.getGenesisHash();
    const exchangeType = 'direct';
    const routingKey = `tb.${genesis}`;

    const messageBuff = JSON.stringify({ service: 'tb', action: 'add', genesis });
    mainChannelAMQP.sendToQueue(RabbitMQueues.GENESISES, Buffer.from(messageBuff));

    await mainChannelAMQP.assertExchange(exchange, exchangeType, {});

    const assertQueue = await mainChannelAMQP.assertQueue('', {});

    await mainChannelAMQP.bindQueue(assertQueue.queue, exchange, routingKey);

    await directExchangeConsumer(mainChannelAMQP, assertQueue);
  } catch (error) {
    console.error(`${new Date()} | Init AMQP error`, error);
  }
}
