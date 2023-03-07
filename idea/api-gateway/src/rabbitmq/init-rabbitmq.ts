import { connect, Connection, Channel } from 'amqplib';
import { initLogger, RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';

import config from '../config/configuration';
import { RpcResponse } from '../json-rpc/types';

let connectionAMQP: Connection;
let mainChannelAMQP: Channel;

const testBalanceChannels: Map<string, Channel> = new Map<string, Channel>();
const dataStorageChannels: Map<string, Channel> = new Map<string, Channel>();
const repliesMap: Map<string, (params: any) => RpcResponse> = new Map<string, (params: any) => RpcResponse>();
const logger = initLogger('RMQ');

export async function initAMQ(): Promise<void> {
  connectionAMQP = await connectAMQP(config.rabbitmq.url);
  mainChannelAMQP = await connectionAMQP.createChannel();

  await mainChannelAMQP.assertExchange(RabbitMQExchanges.TOPIC_EX, 'topic', { durable: true });
  await mainChannelAMQP.assertExchange(RabbitMQExchanges.DIRECT_EX, 'direct', { durable: true });

  await mainChannelAMQP.assertQueue(RabbitMQueues.REPLIES, {
    durable: true,
    exclusive: false,
    autoDelete: false,
    messageTtl: 30_000,
  });

  await mainChannelAMQP.bindQueue(RabbitMQueues.REPLIES, RabbitMQExchanges.DIRECT_EX, RabbitMQueues.REPLIES);

  await mainChannelAMQP.assertQueue(RabbitMQueues.GENESISES, {
    durable: true,
    exclusive: false,
    autoDelete: false,
    messageTtl: 30_000,
  });

  await mainChannelAMQP.bindQueue(RabbitMQueues.GENESISES, RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES);

  await subscribeToGenesises();
  await subscribeToReplies();

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

async function subscribeToReplies(): Promise<void> {
  await mainChannelAMQP.consume(
    RabbitMQueues.REPLIES,
    (message) => {
      if (!message) {
        return;
      }

      const messageContent = JSON.parse(message.content.toString());
      const correlationId = message.properties.correlationId;
      const resultFromService = repliesMap.get(correlationId);

      if (resultFromService) resultFromService(messageContent);

      repliesMap.delete(correlationId);
    },
    { noAck: true },
  );
}

async function subscribeToGenesises() {
  await mainChannelAMQP.consume(
    RabbitMQueues.GENESISES,
    async function (message) {
      if (!message) {
        return;
      }

      const { genesis, service, action } = JSON.parse(message.content.toString());

      if (action === 'add') {
        if (service === 'ds') {
          if (dataStorageChannels.has(genesis)) return;

          const channel = await createChannel();
          dataStorageChannels.set(genesis, channel);
          await channel.assertQueue(`ds.${genesis}`, { durable: false, exclusive: false, autoDelete: true });

          logger.info(`DS: Add new genesis ${genesis}`);
          logger.info(`DS genesises: ${JSON.stringify(Array.from(dataStorageChannels.keys()), undefined, 2)}`);
        }
        if (service === 'tb') {
          if (testBalanceChannels.has(genesis)) return;

          const channel = await createChannel();
          testBalanceChannels.set(genesis, channel);
          await channel.assertQueue(`tb.${genesis}`, { durable: false, exclusive: false });
          logger.info(`TB: Add new genesis ${genesis}`);
          logger.info(`TB genesises: ${JSON.stringify(Array.from(testBalanceChannels.keys()), undefined, 2)}`);
        }
      }

      if (action === 'delete') {
        if (service === 'ds') {
          const channel = dataStorageChannels.get(genesis);
          if (channel) {
            await channel.close();
            dataStorageChannels.delete(genesis);
            logger.info(`DS: Delete genesis ${genesis}`);
            logger.info(`DS genesises: ${JSON.stringify(Array.from(dataStorageChannels.keys()), undefined, 2)}`);
          }
        }
        if (service === 'tb') {
          const channel = testBalanceChannels.get(genesis);
          if (channel) {
            await channel.close();
            testBalanceChannels.delete(genesis);
            logger.info(`TB: Delete new genesis ${genesis}`);
            logger.info(`TB genesises: ${JSON.stringify(Array.from(testBalanceChannels.keys()), undefined, 2)}`);
          }
        }
      }
    },
    { noAck: true },
  );
}

async function createChannel(): Promise<Channel> {
  const channel = await connectionAMQP.createChannel();
  await channel.assertExchange(RabbitMQExchanges.DIRECT_EX, 'direct', { durable: true });
  return channel;
}

export { testBalanceChannels, dataStorageChannels, repliesMap, connectionAMQP, mainChannelAMQP, connectAMQP };
