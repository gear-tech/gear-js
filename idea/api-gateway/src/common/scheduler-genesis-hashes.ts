import { CronJob } from 'cron';
import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from '../kafka/producer';
import { genesisHashesCollection } from './genesis-hashes-collection';

// every 3 hours
const CRON_RUN_TIME = '0 */3 * * *';

function schedulerGenesisHashes(){
  return {
    start() {
      if (!process.env.TEST_ENV) {
        new CronJob(CRON_RUN_TIME, async function () {
          genesisHashesCollection.clear();
          await kafkaProducer.sendByTopic(KAFKA_TOPICS.TEST_BALANCE_SERVICES, 'testBalanceServices');
        }, null, true, '');
      }
    }
  };
}

export { schedulerGenesisHashes };
