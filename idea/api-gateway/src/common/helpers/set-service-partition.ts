import { KafkaMessage } from 'kafkajs';
import { initKafka } from '../../kafka/init-kafka';
import { KAFKA_TOPICS } from '@gear-js/common';
import { servicesPartitionMap } from '../services-partition-map';

export async function setServicePartition(message: KafkaMessage): Promise<void> {
  const { partition, genesis } = JSON.parse(message.value.toString());

  if(!partition && !genesis) return;

  const admin = initKafka.admin();
  const topicOffsets = await admin.fetchTopicOffsets(`${KAFKA_TOPICS.SERVICE_PARTITION_GET}.reply`);

  const topicOffset = topicOffsets.find(topicData => topicData.partition === partition);

  servicesPartitionMap.set(genesis, String(topicOffset.partition));
}
