import { run } from './subsquid/processor';

run().catch((error) => {
  console.log('🔴 Run indexer error', error);
  process.exit(1);
});
