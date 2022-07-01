import express from 'express';
import { KafkaProducer } from './kafka/producer';
import config from './config/configuration';
import { eventListenerLogger } from './common/event-listener.logger';
import { changeStatus, healthcheckRouter } from './routes/healthcheck/healthcheck.router';
import { connectToGearNode } from './gear';

const app = express();

const port = config.healthcheck.port;

app.use('/health', healthcheckRouter);

const startApp = async () => {
  const producer = new KafkaProducer();
  await producer.createTopic('events');
  await producer.connect();
  changeStatus('kafka');

  app.listen(port, () => {
    eventListenerLogger.info(`Healthckech server is running on port ${port} 🚀`);
  });

  // It's neccessary to retain connection during runtimeUpgrade
  while (true) {
    await connectToGearNode(producer);
    console.log('Reconnecting...');
  }
};

startApp().catch((error) => {
  console.error(error);
  process.exit(1);
});
