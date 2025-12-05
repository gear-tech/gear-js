import { runServer } from './api.js';
import { runProcessor } from './runner.js';

async function run() {
  await runProcessor();
  await runServer();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
