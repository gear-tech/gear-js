import { CronJob } from 'cron';
import { KAFKA_TOPICS } from '@gear-js/common';

import configuration from '../../config/configuration';
import { kafkaProducer } from '../../kafka/producer';
import { testBalanceGenesisCollection } from '../test-balance-genesis-collection';

export async function runSchedulerGenesisHashes() {
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.TEST_BALANCE_GENESIS, 'testBalance.genesis');

  const cronTime = configuration.scheduler.genesisHashesTime;

  const cron = new CronJob(cronTime, async function () {
    testBalanceGenesisCollection.clear();

    await kafkaProducer.sendByTopic(KAFKA_TOPICS.TEST_BALANCE_GENESIS, 'testBalance.genesis');
  });

  cron.start();
}
