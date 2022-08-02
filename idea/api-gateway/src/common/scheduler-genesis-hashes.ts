import { CronJob } from 'cron';
import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from '../kafka/producer';
import { genesisHashesCollection } from './genesis-hashes-collection';

let cron: CronJob;

//  5.3 min.sec
const FIVE_MIN_THIRTY_SEC = 5.3 * 60 * 1000;

function schedulerGenesisHashes(){
  return {
    start() {
      cron = new CronJob(getCronRunTime(), async function () {
        genesisHashesCollection.clear();
        await kafkaProducer.sendByTopic(KAFKA_TOPICS.TEST_BALANCE_GENESIS_HASHES, 'testBalance.genesis.hashes');
      });

      if(process.env.TEST_ENV){
        setTimeout(() => {
          cron.stop();
        }, FIVE_MIN_THIRTY_SEC);
      }

      cron.start();
    }
  };
}

function getCronRunTime(): string {
  if (process.env.TEST_ENV){
    // every 5 min
    return '*/5 * * * *';
  }

  // every 3 hours
  return '0 */3 * * *';
}

export { schedulerGenesisHashes };
