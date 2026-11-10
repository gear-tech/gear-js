import type http from 'node:http';
import express, { type Express } from 'express';
import { logger } from 'gear-idea-common';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import config from './config.js';
import { MainnetRouter, VaraBridgeRouter, WvaraRouter } from './routes/index.js';
import { MainnetFaucetService, type RequestService } from './services/index.js';

const swaggerDocument = YAML.load('./swagger.yaml');

export class Server {
  private _app: Express;
  private _server: http.Server;

  constructor(requestService: RequestService, runBridgeFaucet = true, runWvaraFaucet = true, runMainnetFaucet = true) {
    this._app = express();
    this._app.set('trust proxy', true);
    this._app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    if (runBridgeFaucet) {
      this._app.use('/bridge', new VaraBridgeRouter(requestService).router);
    }
    if (runWvaraFaucet) {
      this._app.use('/wvara', new WvaraRouter(requestService).router);
    }
    if (runMainnetFaucet && config.mainnet.enabled) {
      this._app.use('/api/v1/mainnet', new MainnetRouter(new MainnetFaucetService()).router);
      logger.info('Mainnet faucet API enabled');
    }
  }

  run() {
    this._server = this._app.listen(config.server.port, () => {
      logger.info(`Server is running in port ${config.server.port}`);
    });
  }

  close() {
    this._server.close();
  }

  get app() {
    return this._app;
  }
}
