import { logger } from 'gear-idea-common';

import { LastSeenService, RequestService, VaraBridgeProcessor, VaraTestnetProcessor } from './services';
import { AppDataSource } from './database';
import { Server } from './server';
import config from './config';

export class FaucetApp {
  private _lastSeenService: LastSeenService;
  private _requestService: RequestService;
  private _varaTestnetProcessor: VaraTestnetProcessor;
  private _varaBridgeProcessor: VaraBridgeProcessor;
  private _server: Server;

  constructor(
    private _runBridgeFaucet = true,
    private _runVaraTestnetFaucet = true,
  ) {}

  async init() {
    await AppDataSource.initialize();
    logger.info('Database connected');

    this._lastSeenService = new LastSeenService();
    this._requestService = new RequestService(config.varaTestnet.genesis);

    if (this._runVaraTestnetFaucet) {
      this._varaTestnetProcessor = new VaraTestnetProcessor(this._lastSeenService, this._requestService);
      await this._varaTestnetProcessor.init();
    }
    if (this._runBridgeFaucet) {
      this._varaBridgeProcessor = new VaraBridgeProcessor(this._lastSeenService, this._requestService);
      await this._varaBridgeProcessor.init();
    }

    this._server = new Server(this._requestService);
  }

  run() {
    if (this._runVaraTestnetFaucet) {
      this._varaTestnetProcessor.run();
    }
    if (this._runBridgeFaucet) {
      this._varaBridgeProcessor.run();
    }

    this._server.run();
  }

  destroy() {
    this._server.close();
    if (this._runVaraTestnetFaucet) {
      this._varaTestnetProcessor.stop();
    }
    if (this._runBridgeFaucet) {
      this._varaBridgeProcessor.stop();
    }
  }

  get server() {
    return this._server;
  }
}

if (require.main === module) {
  const app = new FaucetApp();

  app
    .init()
    .then(() => app.run())
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
