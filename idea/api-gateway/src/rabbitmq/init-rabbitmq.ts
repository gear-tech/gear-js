import { connect, Connection, Channel } from 'amqplib';

import config from '../config/configuration';

let connectionAMQO: Connection;
let mainChannel: Channel;
const testBalancesMap: Map<string, Channel> = new Map<string, Channel>();
const dataStoragesMap: Map<string, Channel> = new Map<string, Channel>();

export async function initAMQP(): Promise<void> {
  connectionAMQO = await connect(config.rabbitmq.url);
  mainChannel = await connectionAMQO.createChannel();

  await mainChannel.assertExchange('topic.ex', 'topic', { durable: true });
  await mainChannel.assertExchange('direct.ex', 'direct', { durable: true });
  await mainChannel.assertQueue('replies', { durable: true, exclusive: true, messageTtl: 30000 });
  await mainChannel.bindQueue('replies', 'direct.ex', 'replies');
  await mainChannel.assertQueue('genesises', { durable: true, exclusive: true, messageTtl: 30000 });
  await mainChannel.bindQueue('genesises', 'direct.ex', 'genesises');

  await subscribeToGenesises();
}


async function subscribeToGenesises() {
  await mainChannel.consume('genesises', async function (message) {
    if (!message) {
      return;
    }

    const { genesis, service, action } = JSON.parse(message.content.toString());
    if (action === 'add') {
      const channel = await connectionAMQO.createChannel();
      await channel.assertExchange('direct.ex', 'direct', { durable: true });
      if (service === 'ds') {
        dataStoragesMap.set(genesis, channel);
      }
      if (service === 'tb') {
        testBalancesMap.set(genesis, channel);
      }
    }

    if (action === 'delete') {
      if (service === 'ds') {
        const channel = dataStoragesMap.get(genesis);
        await channel.close();
        dataStoragesMap.delete(genesis);
      }
      if (service === 'tb') {
        const channel = testBalancesMap.get(genesis);
        await channel.close();
        testBalancesMap.delete(genesis);
      }
    }
  });
}
