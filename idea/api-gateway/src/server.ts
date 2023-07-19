import { getResponse } from './utils';

import express, { Express, Request, Response } from 'express';
import { checkGenesisMiddleware, captchaMiddleware, validateJsonRpcRequestMiddleware } from './middleware';
import { logger } from './common/logger';
import config from './config';
import { RMQService } from './rabbitmq';
import {
  INDEXER_METHODS,
  META_STORAGE_METHODS,
  RMQMessage,
  RMQReply,
  TEST_BALANCE_METHODS,
  IRpcRequest,
  IRpcResponse,
  JSONRPC_ERRORS,
  API_GATEWAY_METHODS,
} from '@gear-js/common';
import { nanoid } from 'nanoid';

const status = {
  rmq: false,
};

export function changeStatus() {
  status.rmq = !status.rmq;
}

const AVAILABLE_METHODS: string[] = [
  ...Object.values(INDEXER_METHODS),
  ...Object.values(TEST_BALANCE_METHODS),
  ...Object.values(META_STORAGE_METHODS),
];

function isExistJsonRpcMethod(method: string): boolean {
  return AVAILABLE_METHODS.includes(method);
}

const indexerMethods: string[] = Object.values(INDEXER_METHODS);
const metaStorageMethods: string[] = Object.values(META_STORAGE_METHODS);

export class Server {
  private app: Express;

  constructor(private rmq: RMQService) {
    this.app = express();
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    this.setupRoutes();
  }

  private setupRoutes() {
    this.app.post(
      '/api',
      validateJsonRpcRequestMiddleware,
      checkGenesisMiddleware,
      captchaMiddleware,
      async (req: Request, res: Response) => {
        try {
          const result = await this.handleRequest(req.body);
          res.json(result);
        } catch (err) {
          logger.error(`ApiGatewayRouter: ${err}`);
          console.log(req.body);
          console.log(err);
        }
      },
    );

    this.app
      .get('/health', async (_, res: Response) => {
        res.status(status.rmq ? 200 : 500).json({ connected: status });
      })
      .get('/rmq', async (_, res: Response) => {
        res.status(status.rmq ? 200 : 500).json({ connected: status.rmq });
      });
  }

  public run() {
    return this.app.listen(config.server.port, () =>
      console.log(`⚙️ 🚀 App successfully run on the ${config.server.port}`),
    );
  }

  private async jsonRpcHandler(
    method: INDEXER_METHODS | META_STORAGE_METHODS | TEST_BALANCE_METHODS,
    params: unknown,
  ): Promise<RMQReply> {
    const correlationId: string = nanoid(12);
    const genesis = params['genesis'];
    let replyResolve;
    const replyPromise: Promise<RMQReply> = new Promise((resolve) => (replyResolve = resolve));

    const msg: RMQMessage = { correlationId, params, genesis, method };

    if (method === TEST_BALANCE_METHODS.TEST_BALANCE_GET) {
      this.rmq.sendMsgToTestBalance(msg);
    } else if (indexerMethods.includes(method as INDEXER_METHODS)) {
      this.rmq.sendMsgToIndexer(msg);
    } else if (metaStorageMethods.includes(method as META_STORAGE_METHODS)) {
      this.rmq.sendMsgToMetaStorage(msg);
    }

    this.rmq.replies.set(correlationId, replyResolve);

    return replyPromise;
  }

  private async handleRequest(rpcBodyRequest: IRpcRequest | IRpcRequest[]): Promise<IRpcResponse | IRpcResponse[]> {
    if (Array.isArray(rpcBodyRequest)) {
      const promises = rpcBodyRequest.map((rpcBody) => {
        return this.executeProcedure(rpcBody);
      });
      return Promise.all(promises);
    } else {
      return this.executeProcedure(rpcBodyRequest);
    }
  }

  private async executeProcedure(procedure: IRpcRequest): Promise<IRpcResponse> {
    const { method, params } = procedure;

    if (!isExistJsonRpcMethod(method)) {
      return getResponse(procedure, JSONRPC_ERRORS.MethodNotFound.name);
    }

    if (method === API_GATEWAY_METHODS.TEST_BALANCE_AVAILABLE) {
      return getResponse(procedure, null, this.rmq.isExistTBChannel(params.genesis));
    }

    if (method === API_GATEWAY_METHODS.NETWORK_DATA_AVAILABLE) {
      return getResponse(procedure, null, this.rmq.isExistIndexerChannel(params.genesis));
    }

    if (!metaStorageMethods.includes(method) && !this.isValidGenesis(params.genesis, method)) {
      return getResponse(procedure, JSONRPC_ERRORS.UnknownNetwork.name);
    }

    const { error, result } = await this.jsonRpcHandler(method, params);

    return getResponse(procedure, error, result);
  }

  private isValidGenesis(genesis: string, method: string): boolean {
    if (method === TEST_BALANCE_METHODS.TEST_BALANCE_GET) {
      return this.rmq.isExistTBChannel(genesis);
    }
    return this.rmq.isExistIndexerChannel(genesis);
  }
}
