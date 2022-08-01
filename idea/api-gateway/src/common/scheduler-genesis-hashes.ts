import { CronJob } from 'cron';
import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from '../kafka/producer';
import { genesisHashMap } from './genesis-hash-map';

function schedulerGenesisHashes(){
  return {
    start() {
      if (!process.env.TEST_ENV) {
        new CronJob(getCronRunTime(), async function () {
          genesisHashMap.clear();
          await kafkaProducer.sendByTopic(KAFKA_TOPICS.TEST_BALANCE_SERVICES, 'testBalanceServices');
        }, null, true, '');
      }

      if (process.env.TEST_ENV){
        const SEVENTY_SECONDS = 70 * 1000;
        setTimeout(async () => {
          await kafkaProducer.sendByTopic(KAFKA_TOPICS.TEST_BALANCE_SERVICES, 'testBalanceServices');
        }, SEVENTY_SECONDS);
      }
    }
  };
}

function getCronRunTime(): string {
  // every 3 hours
  return '0 */3 * * *';
}

export { schedulerGenesisHashes };
