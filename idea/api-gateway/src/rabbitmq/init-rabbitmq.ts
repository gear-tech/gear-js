import { connect, Connection, Channel } from 'amqplib';
import { RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';

import config from '../config/configuration';
import { RpcResponse } from '../json-rpc/types';

let connectionAMQP: Connection;
let mainChannelAMQP: Channel;

const testBalanceChannels: Map<string, Channel> = new Map<string, Channel>();
const dataStorageChannels: Map<string, Channel> = new Map<string, Channel>();
const repliesMap: Map<string, (params: any) => RpcResponse> = new Map<string, (params: any) => RpcResponse>();

export async function initAMQ(): Promise<void> {
  try {
    connectionAMQP = await connectAMQP(config.rabbitmq.url);
    mainChannelAMQP = await connectionAMQP.createChannel();

    await mainChannelAMQP.assertExchange(RabbitMQExchanges.TOPIC_EX, 'topic', { durable: true });
    await mainChannelAMQP.assertExchange(RabbitMQExchanges.DIRECT_EX, 'direct', { durable: true });

    await mainChannelAMQP.assertQueue(RabbitMQueues.REPLIES, {
      durable: true,
      exclusive: false,
      autoDelete: false,
      messageTtl: 30_000 });

    await mainChannelAMQP.bindQueue(RabbitMQueues.REPLIES, RabbitMQExchanges.DIRECT_EX, RabbitMQueues.REPLIES);

    await mainChannelAMQP.assertQueue(RabbitMQueues.GENESISES, {
      durable: true,
      exclusive: false,
      autoDelete: false,
      messageTtl: 30_000
    });

    await mainChannelAMQP.bindQueue(RabbitMQueues.GENESISES, RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES);

    await subscribeToGenesises();
    await subscribeToReplies();
  } catch (error) {
    console.error(`${new Date()} | Init rabbitMQ error`, error);
  }
}

async function connectAMQP(url: string): Promise<Connection> {
  try {
    return connect(url);
  } catch (error) {
    console.error(`${new Date()} | RabbitMQ connection error`, error);
  }
}

async function subscribeToReplies(): Promise<void> {
  await mainChannelAMQP.consume(RabbitMQueues.REPLIES, (message) => {
    if (!message) {
      return;
    }

    const messageContent = JSON.parse(message.content.toString());
    const correlationId = message.properties.correlationId;
    const resultFromService = repliesMap.get(correlationId);

    if (resultFromService) resultFromService(messageContent);

    repliesMap.delete(correlationId);
  });
}

async function subscribeToGenesises() {
  await mainChannelAMQP.consume(RabbitMQueues.GENESISES, async function (message) {
    if (!message) {
      return;
    }

    const { genesis, service, action } = JSON.parse(message.content.toString());

    if (action === 'add') {
      if (service === 'ds') {
        if(dataStorageChannels.has(genesis)) return;

        const channel = await createChannel();
        dataStorageChannels.set(genesis, channel);
        await channel.assertQueue(`ds.${genesis}`, { durable: false, exclusive: false });
        console.log(`${new Date()} Data storage genesises`);
        console.log(dataStorageChannels.keys());
      }
      if (service === 'tb') {
        if(testBalanceChannels.has(genesis)) return;

        const channel = await createChannel();
        testBalanceChannels.set(genesis, channel);
        await channel.assertQueue(`tb.${genesis}`, { durable: false, exclusive: false });
        console.log(`${new Date()} Test balance genesises`);
        console.log(testBalanceChannels.keys());
      }
    }

    if (action === 'delete') {
      if (service === 'ds') {
        const channel = dataStorageChannels.get(genesis);
        await channel.close();
        dataStorageChannels.delete(genesis);
      }
      if (service === 'tb') {
        const channel = testBalanceChannels.get(genesis);
        await channel.close();
        testBalanceChannels.delete(genesis);
      }
    }
  });
}

async function createChannel(): Promise<Channel> {
  const channel = await connectionAMQP.createChannel();
  await channel.assertExchange(RabbitMQExchanges.DIRECT_EX, 'direct', { durable: true  });
  return channel;
}

export { testBalanceChannels, dataStorageChannels, repliesMap, connectionAMQP, mainChannelAMQP, connectAMQP };
