import { Channel, connect, Connection } from 'amqplib';
import { RMQExchanges, RMQQueues, RMQServiceActions, RMQServices } from '@gear-js/common';

import config from '../config/configuration';
import { gearService } from '../gear';
import { directMessageConsumer, topicMessageConsumer } from './consumer';

export let connectionAMQP: Connection;
export let mainChannelAMQP: Channel;
export let topicChannelAMQP: Channel;

export async function initAMQ(): Promise<void> {
  connectionAMQP = await connectAMQP(config.rabbitmq.url);
  mainChannelAMQP = await connectionAMQP.createChannel();
  topicChannelAMQP = await connectionAMQP.createChannel();
  const directExchange = RMQExchanges.DIRECT_EX;
  const topicExchange = RMQExchanges.TOPIC_EX;
  const genesis = gearService.getGenesisHash();
  const directExchangeType = 'direct';
  const topicExchangeType = 'topic';
  const routingKey = `${RMQServices.TEST_BALANCE}.${genesis}`;

  //send genesis
  const messageBuff = JSON.stringify({ service: RMQServices.TEST_BALANCE, action: RMQServiceActions.ADD, genesis });
  mainChannelAMQP.publish(directExchange, RMQQueues.GENESISES, Buffer.from(messageBuff));

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
    console.log(new Date(), error);
    process.exit(1);
  });
}

async function connectAMQP(url: string): Promise<Connection> {
  try {
    return connect(url);
  } catch (error) {
    console.error(`${new Date()} | RabbitMQ connection error`, error);
  }
}
