import { CronJob } from 'cron';
import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from '../kafka/producer';
import { genesisHashMap } from './genesis-hash-map';


function schedulerGenesisHashes(){
  return {
    start() {
      new CronJob(getCronRunTime(), async function (){
        genesisHashMap.clear();
        await kafkaProducer.sendByTopic(KAFKA_TOPICS.TEST_BALANCE_SERVICES, 'testBalanceServices');
      }, null, true, '');
    }
  };
}

function getCronRunTime(): string {
  if (process.env.TEST_ENV){
    // every 10 seconds
    return '*/10 * * * * *';
  }

  // every three hours
  return '0 */3 * * *';
}

export { schedulerGenesisHashes };
