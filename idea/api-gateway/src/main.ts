import { logger } from './common/logger';
import { RMQService } from './rabbitmq';
import { Server, changeStatus } from './server';

const bootstrap = async () => {
  const rmq = new RMQService();
  await rmq.init();

  logger.info('Connected to RabbitMQ');

  changeStatus();

  const server = new Server(rmq);

  await rmq.runScheduler();

  server.run();
};

bootstrap();
