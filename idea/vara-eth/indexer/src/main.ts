import { runServer } from './api';
import { runProcessor } from './runner';

async function run() {
  await runProcessor();
  await runServer();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
