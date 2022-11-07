import { KafkaMessage } from 'kafkajs';
import { KAFKA_TOPICS } from '@gear-js/common';

import { initKafka } from '../../kafka/init-kafka';
import { dataStoragePartitionsMap } from '../data-storage-partitions-map';

export async function setServicePartition(message: KafkaMessage): Promise<void> {
  const params = JSON.parse(message.value.toString());

  if(!('genesis' in params) || !('partition' in params)) return;

  if(!params.genesis) return;

  if(dataStoragePartitionsMap.has(params.genesis)) return;

  const partitionNum = Number(params.partition);

  const admin = initKafka.admin();
  const topicOffsets = await admin.fetchTopicOffsets(`${KAFKA_TOPICS.SERVICE_PARTITION_GET}.reply`);

  const topicOffset = topicOffsets.find(topicData => topicData.partition === partitionNum);

  dataStoragePartitionsMap.set(params.genesis, String(topicOffset.partition));
}
