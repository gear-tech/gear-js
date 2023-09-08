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
  logger,
} from '@gear-js/common';
import { nanoid } from 'nanoid';
import express, { Express, Request, Response } from 'express';
import { createClient } from 'redis';

import { getResponse } from './utils';
import { checkGenesisMiddleware, captchaMiddleware, validateJsonRpcRequestMiddleware } from './middleware';
import config from './config';
import { RMQService } from './rmq';

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
  ...Object.values(API_GATEWAY_METHODS),
];

const METHODS_FOR_CACHE: string[] = [
  INDEXER_METHODS.CODE_DATA,
  INDEXER_METHODS.PROGRAM_DATA,
  INDEXER_METHODS.MESSAGE_DATA,
  INDEXER_METHODS.PROGRAM_ALL,
  INDEXER_METHODS.MESSAGE_ALL,
  INDEXER_METHODS.CODE_ALL,
  INDEXER_METHODS.STATE_GET,
  INDEXER_METHODS.CODE_STATE_GET,
  INDEXER_METHODS.PROGRAM_STATE_ALL,
  INDEXER_METHODS.CODE_STATE_GET,
  META_STORAGE_METHODS.META_GET,
];

const METHODS_FOR_CACHE_WITH_EXPIRATIONS: Record<string, number> = {
  [INDEXER_METHODS.CODE_DATA]: 60,
  [INDEXER_METHODS.PROGRAM_DATA]: 60,
  [INDEXER_METHODS.MESSAGE_DATA]: 60,
  [INDEXER_METHODS.PROGRAM_ALL]: 20,
  [INDEXER_METHODS.MESSAGE_ALL]: 20,
  [INDEXER_METHODS.CODE_ALL]: 20,
  [INDEXER_METHODS.STATE_GET]: 60,
  [INDEXER_METHODS.CODE_STATE_GET]: 60,
  [INDEXER_METHODS.PROGRAM_STATE_ALL]: 60,
  [META_STORAGE_METHODS.META_GET]: 60,
};

function isExistJsonRpcMethod(method: string): boolean {
  return AVAILABLE_METHODS.includes(method);
}

const indexerMethods: string[] = Object.values(INDEXER_METHODS);
const metaStorageMethods: string[] = Object.values(META_STORAGE_METHODS);

export class Server {
  private app: Express;
  private redisClient: ReturnType<typeof createClient>;
  private isRedisConnected = false;
  private isLoggedRedisError = false;

  constructor(private rmq: RMQService) {
    this.app = express();
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    this.setupRoutes();
    this.redisClient = createClient({
      url: `redis://${config.redis.user}:${config.redis.password}@${config.redis.host}:${config.redis.port}`,
    });
  }

  private setupRoutes() {
    this.app.post(
      '/api',
      validateJsonRpcRequestMiddleware,
      checkGenesisMiddleware,
      captchaMiddleware,
      async (req: Request, res: Response) => {
        try {
          logger.debug('Request', { method: req.body.method, params: req.body.params });
          const result = await this.handleRequest(req.body);
          logger.debug('Response', { result });
          res.json(result);
        } catch (error) {
          logger.error('Handle request error', { error, request: req.body });
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

  public async run() {
    this.redisClient.on('error', (err) => {
      if (!this.isLoggedRedisError) {
        logger.error('Redis Client Error', { error: err.message });
        this.isLoggedRedisError = true;
      }
      this.isRedisConnected = false;
    });
    this.redisClient.on('disconnected', (err) => {
      logger.warn('Redis disconnected', { error: err.message });
      this.isRedisConnected = false;
    });
    this.redisClient.connect().then(() => {
      this.isRedisConnected = true;
      this.isLoggedRedisError = false;
      logger.info('Redis connected');
    });
    return this.app.listen(config.server.port, () => logger.info(`App successfully run on the ${config.server.port}`));
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

    if (this.isRedisConnected && METHODS_FOR_CACHE.includes(method)) {
      const data = await this.redisClient.get(JSON.stringify({ method, params }));
      if (data) {
        const result = JSON.parse(data);
        return getResponse(procedure, null, result);
      }
    }

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

    if (this.isRedisConnected && result && METHODS_FOR_CACHE.includes(method)) {
      this.redisClient
        .set(JSON.stringify({ method, params }), JSON.stringify(result), {
          EX: METHODS_FOR_CACHE_WITH_EXPIRATIONS[method],
        })
        .catch((err) => {
          logger.error('Failed to set value', { service: 'redis', msg: err.message, stack: err.stack });
        });
    }

    return getResponse(procedure, error, result);
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

  private isValidGenesis(genesis: string, method: string): boolean {
    if (method === TEST_BALANCE_METHODS.TEST_BALANCE_GET) {
      return this.rmq.isExistTBChannel(genesis);
    }
    return this.rmq.isExistIndexerChannel(genesis);
  }
}
