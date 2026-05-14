import { FaucetApp } from './app.js';
import config from './config.js';

const app = new FaucetApp(
  config.bridge.erc20Contracts.length > 0,
  !!config.varaTestnet.genesis,
  !!config.wvara.address,
);

app
  .init()
  .then(() => app.run())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
