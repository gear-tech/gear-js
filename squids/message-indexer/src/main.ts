import { run } from './subsquid/processor';

const main = async () => {
  await run();
};

main().catch((error) => {
  console.log('🔴 Run indexer error', error);
  process.exit(1);
});
