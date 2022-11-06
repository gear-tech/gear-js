import { CronJob } from 'cron';
import { KAFKA_TOPICS } from '@gear-js/common';

import configuration from '../../config/configuration';
import { kafkaProducer } from '../../kafka/producer';
import { KafkaParams } from '../../kafka/types';
import { dataStoragePartitionsMap } from '../data-storage-partitions-map';

export async function runSchedulerNetworkDataStorages() {
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.SERVICES_PARTITION, {} as KafkaParams);

  const cronTime = configuration.scheduler.networkDataStoragesTime;

  const cron = new CronJob(cronTime, async function () {
    dataStoragePartitionsMap.clear();

    await kafkaProducer.sendByTopic(KAFKA_TOPICS.SERVICES_PARTITION, {} as KafkaParams);
  });

  cron.start();
}
