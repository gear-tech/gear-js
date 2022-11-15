import { Channel, connect, Connection } from 'amqplib';
import { RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';

import config from '../config/configuration';
import { gearService } from '../gear';
import { directExchangeConsumer, topicExchangeConsumer } from './consumer';

export let connectionAMQP: Connection;
export let mainChannelAMQP: Channel;
export let topicChannelAMQP: Channel;

export async function initAMQP(): Promise<void> {
  try {
    connectionAMQP = await connect(config.rabbitmq.url);
    mainChannelAMQP = await connectionAMQP.createChannel();
    topicChannelAMQP = await connectionAMQP.createChannel();
    const directExchange = RabbitMQExchanges.DIRECT_EX;
    const topicExchange = RabbitMQExchanges.TOPIC_EX;
    const genesis = gearService.getGenesisHash();
    const directExchangeType = 'direct';
    const topicExchangeType = 'topic';
    const routingKey = `tb.${genesis}`;

    const messageBuff = JSON.stringify({ service: 'tb', action: 'add', genesis });
    mainChannelAMQP.sendToQueue(RabbitMQueues.GENESISES, Buffer.from(messageBuff));

    await mainChannelAMQP.assertExchange(directExchange, directExchangeType, { durable: true });
    await mainChannelAMQP.assertExchange(topicExchange, topicExchangeType, { durable: true });

    const assertQueue = await mainChannelAMQP.assertQueue(`tb_AQ_${genesis}`, {
      durable: false,
      autoDelete: true,
    });
    const assertTopicQueue = await topicChannelAMQP.assertQueue(`tb_ATQ_${genesis}`, {
      durable: false,
      autoDelete: true,
    });

    await mainChannelAMQP.bindQueue(assertQueue.queue, directExchange, routingKey);
    await mainChannelAMQP.bindQueue(assertTopicQueue.queue, topicExchange, 'tb.genesises');

    await directExchangeConsumer(mainChannelAMQP, assertQueue);
    await topicExchangeConsumer(topicChannelAMQP, assertTopicQueue);
  } catch (error) {
    console.error(`${new Date()} | Init AMQP error`, error);
  }
}