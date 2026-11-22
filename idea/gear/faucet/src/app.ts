import { logger } from 'gear-idea-common';
import { webSocket } from 'viem';

import config from './config.js';
import { AppDataSource } from './database/index.js';
import { Server } from './server.js';
import { LastSeenService, RequestService, VaraBridgeProcessor } from './services/index.js';

export class FaucetApp {
  private _lastSeenService: LastSeenService;
  private _requestService: RequestService;
  private _varaBridgeProcessor: VaraBridgeProcessor;
  private _server: Server;

  constructor(
    private _runBridgeFaucet: boolean,
    private _runWvaraFaucet: boolean,
  ) {}

  async init() {
    await AppDataSource.initialize();
    logger.info('Database connected');

    this._lastSeenService = new LastSeenService();
    this._requestService = new RequestService(this._lastSeenService);

    await this._requestService.resetProcessing();

    if (this._runBridgeFaucet || this._runWvaraFaucet) {
      if (!config.bridge.ethProvider) throw new Error('ETH_PROVIDER is required');
      const viemTransport = webSocket(config.bridge.ethProvider);
      this._varaBridgeProcessor = new VaraBridgeProcessor(this._lastSeenService, this._requestService);
      await this._varaBridgeProcessor.init(viemTransport);
    }

    this._server = new Server(
      this._requestService,
      this._runBridgeFaucet,
      this._runWvaraFaucet,
      config.mainnet.enabled,
    );
  }

  run() {
    if (this._runBridgeFaucet || this._runWvaraFaucet) {
      this._varaBridgeProcessor.run();
    }

    this._server.run();
  }

  destroy() {
    this._server.close();
    if (this._runBridgeFaucet || this._runWvaraFaucet) {
      this._varaBridgeProcessor.stop();
    }
  }

  get server() {
    return this._server;
  }
}
