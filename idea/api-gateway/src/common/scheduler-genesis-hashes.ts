import { CronJob } from 'cron';
import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from '../kafka/producer';
import { genesisHashMap } from './genesis-hash-map';

let cron: CronJob;

function schedulerGenesisHashes(){
  return {
    start() {
      cron = new CronJob(getCronRunTime(), async function (){
        genesisHashMap.clear();
        await kafkaProducer.sendByTopic(KAFKA_TOPICS.TEST_BALANCE_SERVICES, 'testBalanceServices');
      });

      if (process.env.TEST_ENV){
        const TEN_SECONDS = 10_000;
        setTimeout(() => {
          cron.stop();
        }, TEN_SECONDS);
      }

      cron.start();
    }
  };
}

function getCronRunTime(): string {
  if (process.env.TEST_ENV){
    // every 50 seconds
    return '*/50 * * * * *';
  }

  // every 3 hours
  return '0 */3 * * *';
}

export { schedulerGenesisHashes };
