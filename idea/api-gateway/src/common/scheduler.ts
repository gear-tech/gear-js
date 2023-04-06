import { CronJob } from 'cron';

import configuration from '../config/configuration';
import { producer } from '../rabbitmq/producer';
import { indexerChannels, testBalanceChannels } from '../rabbitmq/init-rabbitmq';

export async function runScheduler() {
  await producer.sendMsgTBGenesises();
  await producer.sendMsgIndexerGenesises();

  const cronTime = configuration.scheduler.genesisHashesTime;

  const cron = new CronJob(cronTime, async function () {
    testBalanceChannels.clear();
    indexerChannels.clear();

    await producer.sendMsgIndexerGenesises();
    await producer.sendMsgTBGenesises();
  });

  cron.start();
}
