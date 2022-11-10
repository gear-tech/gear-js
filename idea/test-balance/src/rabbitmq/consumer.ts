import { rabbitMQ } from './init-rabbitmq';

export async function directExchangeConsumer() {
  try {
    await rabbitMQ.mainChannel.consume(rabbitMQ.assertQueue.queue, (message) => {
      console.log('Received', JSON.parse(message.content.toString()));
      rabbitMQ.mainChannel.ack(message, false);
    });
  } catch (error) {
    console.error('Direct exchange consumer', error);
  }
}
