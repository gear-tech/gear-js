import { initKafka } from '../../kafka/init-kafka';

export async function createKafkaPartitions(){
  const admin = initKafka.admin();
  const topics = await admin.listTopics();

  const createPartitionsPromises = [];

  for(let i = 0; i <= 4; i++){
    for(const topic of topics){
      const topicOffsets = await admin.fetchTopicOffsets(topic);
      const partitionsByTopic = topicOffsets.map(el => el.partition);

      if(!partitionsByTopic.includes(i)){
        const topicPartitions = topics.map(topic => ({ topic, count: i, assignments: null }));
        createPartitionsPromises.push(admin.createPartitions({
          topicPartitions
        }));
      }
    }
  }

  try {
    if(createPartitionsPromises.length >= 1) await Promise.all(createPartitionsPromises);
  } catch (error){
    console.log(error);
  }

}
