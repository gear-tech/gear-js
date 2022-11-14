import { CronJob } from 'cron';

import configuration from '../../config/configuration';
import { dataStorageServicesMap } from '../../rabbitmq/init-rabbitmq';
import { producer } from '../../rabbitmq/producer';

export async function runSchedulerNetworkDataStorages() {
  await producer.sendMessageDSGenesises();

  const cronTime = configuration.scheduler.networkDataStoragesTime;

  const cron = new CronJob(cronTime, async function () {
    dataStorageServicesMap.clear();

    await producer.sendMessageDSGenesises();
  });

  cron.start();
}
