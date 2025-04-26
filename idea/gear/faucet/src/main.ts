import { LastSeenService, RequestService, VaraBridgeProcessor, VaraTestnetProcessor } from './services';
import { AppDataSource } from './database';
import { runServer } from './server';
import config from './config';
import { logger } from 'gear-idea-common';
logger.info('Start');
async function main() {
  await AppDataSource.initialize();
  logger.info('Database connected');

  const lastSeenService = new LastSeenService();
  const requestService = new RequestService(config.varaTestnet.genesis);

  const varaTestnetProcessor = new VaraTestnetProcessor(lastSeenService, requestService);
  await varaTestnetProcessor.init();
  const varaBridgeProcessor = new VaraBridgeProcessor(lastSeenService, requestService);
  await varaBridgeProcessor.init();

  varaTestnetProcessor.run();
  varaBridgeProcessor.run();

  runServer(requestService);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
