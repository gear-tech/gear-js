import { logger } from '@gear-js/common';

import { RMQService } from './rmq';
import { Server, changeStatus } from './server';

const bootstrap = async () => {
  const rmq = new RMQService();
  await rmq.init();

  logger.info('RabbitMQ connection established sucessfuly');

  changeStatus();

  const server = new Server(rmq);

  await rmq.runScheduler();

  server.run();
};

bootstrap();
