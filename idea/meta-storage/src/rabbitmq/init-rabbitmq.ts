import { Channel, connect, Connection } from 'amqplib';
import { API_METHODS, RabbitMQExchanges, RabbitMQueues, RMQServices } from '@gear-js/common';

import config from '../config/configuration';

import { metaService } from '../services/meta/transfer.service';
import { producer } from './producer';

export let connectionAMQP: Connection;
export let mainChannelAMQP: Channel;

export async function initAMQ(): Promise<void> {
  connectionAMQP = await connectAMQP(config.rabbitmq.url);
  mainChannelAMQP = await connectionAMQP.createChannel();
  const directExchange = RabbitMQExchanges.DIRECT_EX;
  const directExchangeType = 'direct';

  await mainChannelAMQP.assertExchange(directExchange, directExchangeType);

  await mainChannelAMQP.assertQueue(RMQServices.META_STORAGE, {
    durable: false,
    autoDelete: false,
    exclusive: false,
    messageTtl: 30_000,
  });

  await mainChannelAMQP.bindQueue(RMQServices.META_STORAGE, directExchange, RMQServices.META_STORAGE);
  await directMessageConsumer(mainChannelAMQP, RMQServices.META_STORAGE);

  connectionAMQP.on('close', (error) => {
    console.log(new Date(), error);
    process.exit(1);
  });
}

export async function directMessageConsumer(channel: Channel, queue: string): Promise<void> {
  try {
    await channel.consume(
      queue,
      async (message) => {
        const payload = JSON.parse(message.content.toString());
        const method = message.properties.headers.method;
        const correlationId = message.properties.correlationId;

        const res = await handleIncomingMsg(method, payload);
        producer.sendMessage(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.REPLIES, correlationId, res);
      },
      { noAck: true },
    );
  } catch (error) {
    console.error(`${new Date()} | Direct exchange consumer error`, error);
  }
}

async function handleIncomingMsg(method: string, params: any): Promise<any> {
  const methods = {
    [API_METHODS.META_ADD]: () => metaService.create(params),
    [API_METHODS.META_GET]: () => metaService.getByHash(params.hash),
  };

  try {
    return methods[method]();
  } catch (error) {
    console.log(error);
    return;
  }
}

async function connectAMQP(url: string): Promise<Connection> {
  try {
    return connect(url);
  } catch (error) {
    console.error(`${new Date()} | RabbitMQ connection error`, error);
  }
}
