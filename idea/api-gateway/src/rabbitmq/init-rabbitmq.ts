import { connect, Connection, Channel } from 'amqplib';
import { RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';

import config from '../config/configuration';
import { IMessageNetworkDSParams, IMessageTestBalanceParams } from './types';

let connectionAMQO: Connection;
let mainChannel: Channel;

const testBalanceServicesMap: Map<string, Channel> = new Map<string, Channel>();
const dataStorageServicesMap: Map<string, Channel> = new Map<string, Channel>();

export async function initAMQP(): Promise<void> {
  try {
    connectionAMQO = await connect(config.rabbitmq.url);
    mainChannel = await connectionAMQO.createChannel();

    await mainChannel.assertExchange(RabbitMQExchanges.TOPIC_EX, 'topic', { durable: true });
    await mainChannel.assertExchange(RabbitMQExchanges.DIRECT_EX, 'direct', { durable: true });
    const repliesAssertQueue =  await mainChannel.assertQueue(RabbitMQueues.REPLIES, {
      durable: true,
      exclusive: true,
      messageTtl: 30_000 });

    await mainChannel.bindQueue(repliesAssertQueue.queue, RabbitMQExchanges.DIRECT_EX, RabbitMQueues.REPLIES);
    const genesisesAssertQueue = await mainChannel.assertQueue(RabbitMQueues.GENESISES, {
      durable: true,
      exclusive: true,
      messageTtl: 30_000 });

    await mainChannel.bindQueue(genesisesAssertQueue.queue, RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES);

    await subscribeToGenesises();
    await subscribeToReplies();
  } catch (error) {
    console.log('Init rabbitMQ error', error);
  }
}

async function subscribeToReplies(): Promise<void> {
  await mainChannel.consume(RabbitMQueues.REPLIES, (message) => {
    if (message) {
      console.log(message);
    }
  });
}

async function subscribeToGenesises() {
  await mainChannel.consume(RabbitMQueues.GENESISES, async function (message) {
    if (!message) {
      return;
    }

    const { genesis, service, action } = JSON.parse(message.content.toString());
    if (action === 'add') {
      const channel = await connectionAMQO.createChannel();
      await channel.assertExchange(RabbitMQExchanges.DIRECT_EX, 'direct', { durable: true });
      if (service === 'ds') {
        dataStorageServicesMap.set(genesis, channel);
      }
      if (service === 'tb') {
        testBalanceServicesMap.set(genesis, channel);
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

async function sendMessageToDataStorage(messageNetworkDSParams: IMessageNetworkDSParams) {
  const { genesis, params, correlationId, method } = messageNetworkDSParams;

  if (!dataStorageServicesMap.has(genesis)) {
    throw new Error(`There is no data storage service listening to the network with geneis ${genesis}`);
  }

  const channel = dataStorageServicesMap.get(genesis);

  await channel.assertQueue(`ds.${genesis}`, { durable: false, exclusive: true });

  channel.publish(RabbitMQExchanges.DIRECT_EX, `ds.${genesis}`, Buffer.from(JSON.stringify(params)), {
    correlationId,
    headers: { method },
  });
}

async function sendMessageToTestBalance(messageTestBalanceParams: IMessageTestBalanceParams) {
  const { genesis, params, correlationId } = messageTestBalanceParams;

  if (!testBalanceServicesMap.has(genesis)) {
    throw new Error(`There is no test balance service interacting with the network with geneis ${genesis}`);
  }

  const channel = testBalanceServicesMap.get(genesis);

  await channel.assertQueue(`tb.${genesis}`, { durable: false, exclusive: true });

  channel.publish(RabbitMQExchanges.DIRECT_EX, `tb.${genesis}`, Buffer.from(params), { correlationId });
}

export const rabbitMQ = {
  sendMessageToDataStorage,
  sendMessageToTestBalance
};

export { testBalanceServicesMap, dataStorageServicesMap };
