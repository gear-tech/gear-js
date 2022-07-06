import { kafkaProducer } from './producer';

async function kafkaCreateConnection(): Promise<void> {
  await kafkaProducer.createTopic('events');
  await kafkaProducer.connect();
}

export { kafkaCreateConnection };
