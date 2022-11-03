import { initKafka } from '../../kafka/init-kafka';

export async function createKafkaPartitions(){
  const admin = initKafka.admin();
  const topics = await admin.listTopics();

  const createPartitionsPromises = [];

  const topicPartitions = topics.map(topic => ({ topic, count: 10, assignments: [] }));

  createPartitionsPromises.push(admin.createPartitions({ topicPartitions }));

  try {
    await Promise.all(createPartitionsPromises);
  } catch (error) {
    console.log(error);
  }
}
