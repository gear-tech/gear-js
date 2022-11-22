import { CronJob } from 'cron';

import configuration from '../../config/configuration';
import { producer } from '../../rabbitmq/producer';
import { testBalanceChannels } from '../../rabbitmq/init-rabbitmq';

export async function runSchedulerGenesisHashes() {
  await producer.sendMessageTBGenesises();

  const cronTime = configuration.scheduler.genesisHashesTime;

  const cron = new CronJob(cronTime, async function () {
    testBalanceChannels.clear();

    await producer.sendMessageTBGenesises();
  });

  cron.start();
}
