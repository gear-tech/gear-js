import { CronJob } from 'cron';
import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from '../kafka/producer';
import { genesisHashMap } from './genesis-hash-map';

const cronRunEveryThreeHours = '0 */3 * * *';

function schedulerGenesisHashes(){
  return {
    start() {
      new CronJob(cronRunEveryThreeHours, async function (){
        genesisHashMap.clear();
        await kafkaProducer.sendByTopic(KAFKA_TOPICS.TEST_BALANCE_SERVICES, 'testBalanceServices');
      }, null, true, '');
    }
  };
}

export { schedulerGenesisHashes };
