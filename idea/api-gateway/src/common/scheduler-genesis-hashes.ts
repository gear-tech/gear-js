import { CronJob } from 'cron';
import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from '../kafka/producer';
import { genesisHashesCollection } from './genesis-hashes-collection';

let cron: CronJob;

//  3.30 min.sec
const TREE_MIN_THIRTY_SEC = 3.3 * 60 * 1000;

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
        }, TREE_MIN_THIRTY_SEC);
      }

      cron.start();
    }
  };
}

function getCronRunTime(): string {
  if (process.env.TEST_ENV){
    // every 3 min
    return '*/3 * * * *';
  }

  // every 3 hours
  return '0 */3 * * *';
}

export { schedulerGenesisHashes };
