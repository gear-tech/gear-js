import { connect, Connection, Channel } from 'amqplib';
import { RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';

import config from '../config/configuration';
import { RpcResponse } from '../json-rpc/types';

let connectionAMQP: Connection;
let mainChannelAMQP: Channel;

const testBalanceServicesMap: Map<string, Channel> = new Map<string, Channel>();
const dataStorageServicesMap: Map<string, Channel> = new Map<string, Channel>();
const rabbitMQEventMap: Map<string, (params: any) => RpcResponse> = new Map<string, (params: any) => RpcResponse>();

export async function initAMQP(): Promise<void> {
  try {
    connectionAMQP = await connect(config.rabbitmq.url);
    mainChannelAMQP = await connectionAMQP.createChannel();

    await mainChannelAMQP.assertExchange(RabbitMQExchanges.TOPIC_EX, 'topic', { durable: true });
    await mainChannelAMQP.assertExchange(RabbitMQExchanges.DIRECT_EX, 'direct', { durable: true });
    const repliesAssertQueue = await mainChannelAMQP.assertQueue(RabbitMQueues.REPLIES, {
      durable: true,
      exclusive: true,
      messageTtl: 30_000 });

    await mainChannelAMQP.bindQueue(repliesAssertQueue.queue, RabbitMQExchanges.DIRECT_EX, RabbitMQueues.REPLIES);

    const genesisesAssertQueue = await mainChannelAMQP.assertQueue(RabbitMQueues.GENESISES, {
      durable: true,
      exclusive: true,
      messageTtl: 30_000
    });

    await mainChannelAMQP.bindQueue(genesisesAssertQueue.queue, RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES);
    await mainChannelAMQP.bindQueue(genesisesAssertQueue.queue, RabbitMQExchanges.TOPIC_EX, RabbitMQueues.GENESISES);

    await subscribeToGenesises();
    await subscribeToReplies();
  } catch (error) {
    console.error(`${new Date()} | Init rabbitMQ error`, error);
  }
}

async function subscribeToReplies(): Promise<void> {
  await mainChannelAMQP.consume(RabbitMQueues.REPLIES, (message) => {
    if (!message) {
      return;
    }

    const messageContent = JSON.parse(message.content.toString());
    const correlationId = message.properties.correlationId;
    const resultFromService = rabbitMQEventMap.get(correlationId);

    if (resultFromService) resultFromService(messageContent);

    rabbitMQEventMap.delete(correlationId);
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
        if(dataStorageServicesMap.has(genesis)) return;

        const channel = await createChannel();
        dataStorageServicesMap.set(genesis, channel);
        await channel.assertQueue(`ds.${genesis}`, { durable: true, exclusive: true });
        console.log(`${new Date()} Data storage genesises`);
        console.log(dataStorageServicesMap.keys());
      }
      if (service === 'tb') {
        if(testBalanceServicesMap.has(genesis)) return;

        const channel = await createChannel();
        testBalanceServicesMap.set(genesis, channel);
        await channel.assertQueue(`tb.${genesis}`, { durable: true, exclusive: true });
        console.log(`${new Date()} Test balance genesises`);
        console.log(testBalanceServicesMap.keys());
      }
    }

    if (action === 'delete') {
      if (service === 'ds') {
        const channel = dataStorageServicesMap.get(genesis);
        await channel.close();
        dataStorageServicesMap.delete(genesis);
      }
      if (service === 'tb') {
        const channel = testBalanceServicesMap.get(genesis);
        await channel.close();
        testBalanceServicesMap.delete(genesis);
      }
    }
  });
}

async function createChannel(): Promise<Channel> {
  const channel = await connectionAMQP.createChannel();
  await channel.assertExchange(RabbitMQExchanges.DIRECT_EX, 'direct', { durable: true  });
  return channel;
}

export { testBalanceServicesMap, dataStorageServicesMap, rabbitMQEventMap, connectionAMQP, mainChannelAMQP };
