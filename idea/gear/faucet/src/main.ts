import { logger } from 'gear-idea-common';

import { LastSeenService, RequestService, VaraBridgeProcessor, VaraTestnetProcessor } from './services';
import { AppDataSource } from './database';
import { Server } from './server';
import config from './config';
import { webSocket } from 'viem';

export class FaucetApp {
  private _lastSeenService: LastSeenService;
  private _requestService: RequestService;
  private _varaTestnetProcessor: VaraTestnetProcessor;
  private _varaBridgeProcessor: VaraBridgeProcessor;
  private _server: Server;

  constructor(
    private _runBridgeFaucet: boolean,
    private _runVaraTestnetFaucet: boolean,
    private _runWvaraFaucet: boolean,
  ) {}

  async init() {
    await AppDataSource.initialize();
    logger.info('Database connected');

    this._lastSeenService = new LastSeenService();
    this._requestService = new RequestService(config.varaTestnet.genesis, this._lastSeenService);

    await this._requestService.resetProcessing();

    if (this._runVaraTestnetFaucet) {
      this._varaTestnetProcessor = new VaraTestnetProcessor(this._lastSeenService, this._requestService);
      await this._varaTestnetProcessor.init();
    }

    if (this._runBridgeFaucet || this._runWvaraFaucet) {
      if (!config.bridge.ethProvider) throw new Error('ETH_PROVIDER is required');
      const viemTransport = webSocket(config.bridge.ethProvider);
      this._varaBridgeProcessor = new VaraBridgeProcessor(this._lastSeenService, this._requestService);
      await this._varaBridgeProcessor.init(viemTransport);
    }

    this._server = new Server(
      this._requestService,
      this._runBridgeFaucet,
      this._runVaraTestnetFaucet,
      this._runWvaraFaucet,
      config.agent.enabled,
    );
  }

  run() {
    if (this._runVaraTestnetFaucet) {
      this._varaTestnetProcessor.run();
    }
    if (this._runBridgeFaucet || this._runWvaraFaucet) {
      this._varaBridgeProcessor.run();
    }

    this._server.run();
  }

  destroy() {
    this._server.close();
    if (this._runVaraTestnetFaucet) {
      this._varaTestnetProcessor.stop();
    }
    if (this._runBridgeFaucet || this._runWvaraFaucet) {
      this._varaBridgeProcessor.stop();
    }
  }

  get server() {
    return this._server;
  }
}

if (require.main === module) {
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
}
