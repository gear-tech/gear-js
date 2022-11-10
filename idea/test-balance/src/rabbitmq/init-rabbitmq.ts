import { Channel, connect, Connection } from 'amqplib';

import config from '../config/configuration';
import { RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';
import { gearService } from '../gear';
import { directExchangeConsumer } from './consumer';

let connectionAMQP: Connection;
let mainChannel: Channel;
let assertQueue;

async function initAMQP(): Promise<void> {
  try {
    connectionAMQP = await connect(config.rabbitmq.url);
    mainChannel = await connectionAMQP.createChannel();
    await mainChannel.prefetch(1);
    const exchange = RabbitMQExchanges.DIRECT_EX;
    const genesis = gearService.getGenesisHash();
    const exchangeType = 'direct';

    const messageBuff = JSON.stringify({ service: 'tb', action: 'add', genesis });
    mainChannel.sendToQueue(RabbitMQueues.GENESISES, Buffer.from(messageBuff));

    await mainChannel.assertExchange(exchange, exchangeType, { durable: false });

    assertQueue = await mainChannel.assertQueue(RabbitMQExchanges.DIRECT_EX, {});

    await mainChannel.bindQueue(assertQueue.queue, exchange, `dt.${genesis}`);

    await directExchangeConsumer();
  } catch (error) {
    console.error('Init AMQP error', error);
  }
}

export const rabbitMQ = { mainChannel, connectionAMQP, assertQueue };
