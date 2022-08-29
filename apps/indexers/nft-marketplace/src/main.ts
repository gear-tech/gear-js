import { handlersAreReady } from './handlers';
import { run } from './processor';

const main = async () => {
  await handlersAreReady;
  run();
};

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
