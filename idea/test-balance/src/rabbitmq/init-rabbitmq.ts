import { Channel, connect, Connection } from 'amqplib';
import { RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';
import { CronJob } from 'cron';

import config from '../config/configuration';
import { gearService } from '../gear';
import { directMessageConsumer, topicMessageConsumer } from './consumer';

export let connectionAMQP: Connection;
export let mainChannelAMQP: Channel;
export let topicChannelAMQP: Channel;

export async function initAMQ(): Promise<void> {
  try {
    connectionAMQP = await connectAMQP(config.rabbitmq.url);
    mainChannelAMQP = await connectionAMQP.createChannel();
    topicChannelAMQP = await connectionAMQP.createChannel();
    const directExchange = RabbitMQExchanges.DIRECT_EX;
    const topicExchange = RabbitMQExchanges.TOPIC_EX;
    const genesis = gearService.getGenesisHash();
    const directExchangeType = 'direct';
    const topicExchangeType = 'topic';
    const routingKey = `tb.${genesis}`;

    //send genesis
    const messageBuff = JSON.stringify({ service: 'tb', action: 'add', genesis });
    mainChannelAMQP.publish(directExchange, RabbitMQueues.GENESISES, Buffer.from(messageBuff));

    await mainChannelAMQP.assertExchange(directExchange, directExchangeType);
    await mainChannelAMQP.assertExchange(topicExchange, topicExchangeType);

    const assertTopicQueue = await topicChannelAMQP.assertQueue(`tbt.${genesis}`, {
      durable: false,
      autoDelete: true,
      exclusive: false,
    });

    await mainChannelAMQP.bindQueue(routingKey, directExchange, routingKey);
    await mainChannelAMQP.bindQueue(assertTopicQueue.queue, topicExchange, 'tb.genesises');

    await directMessageConsumer(mainChannelAMQP, routingKey);
    await topicMessageConsumer(topicChannelAMQP, assertTopicQueue);
    checkConnectionRabbitMQ();
  } catch (error) {
    console.error(`${new Date()} | Init AMQP error`, error);
  }
}

async function connectAMQP(url: string): Promise<Connection> {
  try {
    return connect(url);
  } catch (error) {
    console.error(`${new Date()} | RabbitMQ connection error`, error);
  }
}

function checkConnectionRabbitMQ() {
  const cron = new CronJob(config.scheduler.checkRabbitMQConnectionTime, async function () {
    const connection = await connectionAMQP.createChannel();
    await connection.close();
  });

  cron.start();
}
