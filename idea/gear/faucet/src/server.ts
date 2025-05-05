import swaggerUi from 'swagger-ui-express';
import { logger } from 'gear-idea-common';
import express, { Express } from 'express';
import YAML from 'yamljs';
import http from 'node:http';

import { VaraBridgeRouter, VaraTestnetRouter } from './routes';
import { RequestService } from './services';
import config from './config';

const swaggerDocument = YAML.load('./swagger.yaml');

export class Server {
  private _app: Express;
  private _server: http.Server;

  constructor(requestService: RequestService, runBridgeFaucet = true, runVaraTestnetFaucet = true) {
    this._app = express();
    this._app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    if (runVaraTestnetFaucet) {
      this._app.use('/', new VaraTestnetRouter(requestService).router);
    }
    if (runBridgeFaucet) {
      this._app.use('/bridge', new VaraBridgeRouter(requestService).router);
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
