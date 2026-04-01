import type http from 'node:http';
import express, { type Express } from 'express';
import { logger } from 'gear-idea-common';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import config from './config';
import { AgentRouter, VaraBridgeRouter, VaraTestnetRouter, WvaraRouter } from './routes';
import { ChallengeService, type RequestService } from './services';

const swaggerDocument = YAML.load('./swagger.yaml');

export class Server {
  private _app: Express;
  private _server: http.Server;
  private _challengeService: ChallengeService | null = null;

  constructor(
    requestService: RequestService,
    runBridgeFaucet = true,
    runVaraTestnetFaucet = true,
    runWvaraFaucet = true,
    runAgentFaucet = true,
  ) {
    this._app = express();
    this._app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    if (runVaraTestnetFaucet) {
      this._app.use('/', new VaraTestnetRouter(requestService).router);
    }
    if (runBridgeFaucet) {
      this._app.use('/bridge', new VaraBridgeRouter(requestService).router);
    }
    if (runWvaraFaucet) {
      this._app.use('/wvara', new WvaraRouter(requestService).router);
    }
    if (runAgentFaucet && config.agent.enabled) {
      this._challengeService = new ChallengeService(config.agent.challengeTtlMs);
      this._app.use('/', new AgentRouter(requestService, this._challengeService).router);
      logger.info('Agent faucet enabled');
    }
  }

  run() {
    this._server = this._app.listen(config.server.port, () => {
      logger.info(`Server is running in port ${config.server.port}`);
    });
  }

  close() {
    this._server.close();
    if (this._challengeService) {
      this._challengeService.stop();
    }
  }

  get app() {
    return this._app;
  }
}
