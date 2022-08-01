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
        const SEVENTY_SECONDS = 70 * 1000;
        setTimeout(() => {
          cron.stop();
        }, SEVENTY_SECONDS);
      }

      cron.start();
    }
  };
}

function getCronRunTime(): string {
  if (process.env.TEST_ENV){
    // every 1 min
    return '* * * * *';
  }

  // every 3 hours
  return '0 */3 * * *';
}

export { schedulerGenesisHashes };
