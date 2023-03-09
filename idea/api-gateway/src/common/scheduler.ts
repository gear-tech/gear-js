import { CronJob } from 'cron';

import configuration from '../config/configuration';
import { producer } from '../rabbitmq/producer';
import { dataStorageChannels, testBalanceChannels } from '../rabbitmq/init-rabbitmq';

export async function runScheduler() {
  await producer.sendMessageTBGenesises();
  await producer.sendMessageDSGenesises();

  const cronTime = configuration.scheduler.genesisHashesTime;

  const cron = new CronJob(cronTime, async function () {
    testBalanceChannels.clear();
    dataStorageChannels.clear();

    await producer.sendMessageDSGenesises();
    await producer.sendMessageTBGenesises();
  });

  cron.start();
}
