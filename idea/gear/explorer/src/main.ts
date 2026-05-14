import { readFileSync } from 'node:fs';
import { DataCache } from 'gear-idea-common';
import { createDbConnection, type DbConfig } from 'gear-idea-indexer-db';

import { config } from './config.js';
import { initCache } from './middlewares/caching.js';
import { retryMethodsJob } from './middlewares/retry.js';
import { HybridApiServer } from './server.js';
import { AllInOneService } from './services/all-in-one.js';

const main = async () => {
  const spec = JSON.parse(readFileSync(config.spec, 'utf8')) as Record<string, DbConfig>;

  const dataCache = await DataCache.connect(config.redis);
  initCache(dataCache);

  const services = new Map<string, AllInOneService>();

  for (const [genesis, conf] of Object.entries(spec)) {
    const dataSource = await createDbConnection(conf);
    services.set(genesis, new AllInOneService(dataSource, genesis, dataCache));
  }

  const server = new HybridApiServer(services);

  await server.run();

  retryMethodsJob(server);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
