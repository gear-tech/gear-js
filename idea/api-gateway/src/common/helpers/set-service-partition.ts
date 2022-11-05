import { KafkaMessage } from 'kafkajs';
import { initKafka } from '../../kafka/init-kafka';
import { KAFKA_TOPICS } from '@gear-js/common';
import { dataStoragePartitionsMap } from '../data-storage-partitions-map';

export async function setServicePartition(message: KafkaMessage): Promise<void> {
  const value = JSON.parse(message.value.toString());

  if(!('genesis' in value) || !('partition' in value)) return;

  if(!value.genesis) return;

  if(dataStoragePartitionsMap.has(value.genesis)) return;

  const partitionNum = Number(value.partition);

  const admin = initKafka.admin();
  const topicOffsets = await admin.fetchTopicOffsets(`${KAFKA_TOPICS.SERVICE_PARTITION_GET}.reply`);

  const topicOffset = topicOffsets.find(topicData => topicData.partition === partitionNum);

  dataStoragePartitionsMap.set(value.genesis, String(topicOffset.partition));
}
