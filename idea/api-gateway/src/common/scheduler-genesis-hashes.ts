import { CronJob } from 'cron';
import { KAFKA_TOPICS } from '@gear-js/common';

import configuration from '../config/configuration';

import { kafkaProducer } from '../kafka/producer';
import { genesisHashesCollection } from './genesis-hashes-collection';

let cron: CronJob;

//  1 min
const ONE_MIN = 60 * 1000;
const cronTime = configuration().cron.time;

function schedulerGenesisHashes(){
  return {
    start() {
      cron = new CronJob(process.env.TEST_ENV ?  '*/30 * * * * *'  : '0 */3 * * *', async function () {
        genesisHashesCollection.clear();
        await kafkaProducer.sendByTopic(KAFKA_TOPICS.TEST_BALANCE_GENESIS_HASHES, 'testBalance.genesis.hashes');
      });

      if(process.env.TEST_ENV){
        setTimeout(() => {
          cron.stop();
        }, ONE_MIN);
      }

      cron.start();
    }
  };
}

export { schedulerGenesisHashes };
