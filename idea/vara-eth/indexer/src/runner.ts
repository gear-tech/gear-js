import { createLogger } from '@gear-js/logger';
import type { LogRequest } from '@subsquid/evm-processor/lib/interfaces/data-request.js';
import { TypeormDatabase } from '@subsquid/typeorm-store';
import { VaraEthApi, type WsUrl } from '@vara-eth/api';
import { config } from './config.js';
import { FailoverWsProvider } from './failover-ws-provider.js';
import { BaseHandler } from './handlers/base.js';
import { handlers } from './handlers/index.js';
import { RouterHandler } from './handlers/router.js';
import { InjectedTransactionModule } from './modules/injected-transaction.js';
import { processor } from './processor.js';

const logger = createLogger('vara-eth-proc');

export class VaraEthProcessor {
  private _handlers: BaseHandler[] = [];
  private _routerHandler: RouterHandler | null = null;
  private _injectedTxModule: InjectedTransactionModule | null = null;

  public setInjectedTxModule(routerHandler: RouterHandler, module: InjectedTransactionModule) {
    this._routerHandler = routerHandler;
    this._injectedTxModule = module;
  }

  public addLogs(addr?: string, topics?: string[]) {
    logger.info(`Adding logs ${topics?.join(',')} for ${addr}`);
    const logReq: LogRequest = {
      transaction: true,
    };

    if (addr) {
      logReq.address = [addr];
    }
    if (topics) {
      logReq.topic0 = topics;
    }

    processor.addLog(logReq);
  }

  public addTransactions(addr: string, sighash: string[]) {
    logger.info(`Adding transactions ${sighash.join(',')} for ${addr}`);
    processor.addTransaction({ to: [addr], sighash });
  }

  public registerHandler(handler: BaseHandler) {
    logger.info(`Registering ${handler.constructor.name}`);
    this._handlers.push(handler);

    const logs = handler.getLogs();
    for (const log of logs) {
      this.addLogs(log.addr, log.topic0);
    }

    const transactions = handler.getTransactions();
    for (const transaction of transactions) {
      this.addTransactions(transaction.addr, transaction.sighash);
    }
  }

  public async run() {
    const db = new TypeormDatabase({
      supportHotBlocks: true,
      stateSchema: 'vara_eth_processor',
    });

    processor.run(db, async (ctx) => {
      for (const handler of this._handlers) {
        try {
          ctx.log.debug(`Processing handler: ${handler.constructor.name}`);
          await handler.process(ctx);
        } catch (error) {
          ctx.log.error(
            {
              error: error instanceof Error ? error.message : String(error),
              handler: handler.constructor.name,
              stack: error instanceof Error ? error.stack : undefined,
            },
            'Error processing handler',
          );
          if (process.env.NODE_ENV === 'development') {
            ctx.log.error('Exiting due to handler error in development mode');
            process.exit(1);
          }
        }
      }

      if (this._routerHandler && this._injectedTxModule) {
        const repliedToIds = this._routerHandler.getRepliedToIds();
        const messageSentIds = this._routerHandler.getMessageSentIds();
        await this._injectedTxModule.process(ctx, repliedToIds, messageSentIds);
      }

      for (const handler of this._handlers) {
        await handler.save();
      }
    });
  }
}

export async function runProcessor() {
  const provider = new FailoverWsProvider(config.varaEthNodeUrls as WsUrl[]);
  const client = await VaraEthApi.create(provider);
  const injectedTxModule = new InjectedTransactionModule(client);

  const proc = new VaraEthProcessor();
  let routerHandler: RouterHandler | null = null;

  for (const Handler of Object.values(handlers)) {
    if (Handler.prototype instanceof BaseHandler) {
      const handler = new Handler();
      logger.info(`Initializing handler: ${Handler.constructor.name}`);
      await handler.init();
      logger.info(`Registering new handler: ${Handler.constructor.name}`);
      proc.registerHandler(handler);
      if (handler instanceof RouterHandler) routerHandler = handler;
    }
  }

  if (routerHandler) {
    proc.setInjectedTxModule(routerHandler, injectedTxModule);
  } else {
    logger.warn('RouterHandler not found — injected transaction indexing disabled');
  }

  await proc.run();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runProcessor().catch((error) => {
    logger.error(error);
    process.exit(1);
  });
}
