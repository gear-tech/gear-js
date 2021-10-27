import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'test' });
await consumer.connect();
await consumer.subscribe({ topic: 'events', fromBeginning: true });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      value: message.value.toString(),
    });
  },
});
