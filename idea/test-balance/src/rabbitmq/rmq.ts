import { Channel, connect, Connection } from 'amqplib';
import { logger, RMQExchange, RMQQueue, RMQServiceAction, RMQServices } from '@gear-js/common';

import config from '../config/configuration';
import { gearService } from '../gear';
import { directMessageConsumer, topicMessageConsumer } from './consumer';

export let connectionAMQP: Connection;
export let mainChannelAMQP: Channel;
export let topicChannelAMQP: Channel;

export async function initAMQ(): Promise<void> {
  try {
    connectionAMQP = await connect(config.rabbitmq.url);
  } catch (error) {
    logger.error('RabbitMQ connection error', { error });
  }

  mainChannelAMQP = await connectionAMQP.createChannel();
  topicChannelAMQP = await connectionAMQP.createChannel();
  const directExchange = RMQExchange.DIRECT_EX;
  const topicExchange = RMQExchange.TOPIC_EX;
  const genesis = gearService.getGenesisHash();
  const directExchangeType = 'direct';
  const topicExchangeType = 'topic';
  const routingKey = `${RMQServices.TEST_BALANCE}.${genesis}`;

  //send genesis
  const messageBuff = JSON.stringify({ service: RMQServices.TEST_BALANCE, action: RMQServiceAction.ADD, genesis });
  mainChannelAMQP.publish(directExchange, RMQQueue.GENESISES, Buffer.from(messageBuff));

  await mainChannelAMQP.assertExchange(directExchange, directExchangeType);
  await mainChannelAMQP.assertExchange(topicExchange, topicExchangeType);

  const assertTopicQueue = await topicChannelAMQP.assertQueue(`${RMQServices.TEST_BALANCE}t.${genesis}`, {
    durable: false,
    autoDelete: true,
    exclusive: false,
  });
  await mainChannelAMQP.assertQueue(routingKey, {
    durable: false,
    autoDelete: false,
    exclusive: false,
  });
  await mainChannelAMQP.bindQueue(routingKey, directExchange, routingKey);
  await mainChannelAMQP.bindQueue(assertTopicQueue.queue, topicExchange, `${RMQServices.TEST_BALANCE}.genesises`);

  await directMessageConsumer(mainChannelAMQP, routingKey);
  await topicMessageConsumer(topicChannelAMQP, assertTopicQueue);

  connectionAMQP.on('close', (error) => {
    logger.error('RabbitMQ connection closed', { error });
    process.exit(1);
  });
}
