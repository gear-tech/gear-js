import { TypeormDatabase } from '@subsquid/typeorm-store';

import { BaseHandler } from './handlers/base';
import * as handlers from './handlers';
import { processor } from './processor';

export class VaraEthProcessor {
  private _handlers: BaseHandler[] = [];

  public addLogs(addr: string, topic0: string[]) {
    console.log(`[*] Adding logs ${topic0.join(',')} for ${addr}`);
    processor.addLog({ address: [addr], topic0, transaction: true });
  }

  public addTransactions(addr: string, sighash: string[]) {
    console.log(`[*] Adding transactions ${sighash.join(',')} for ${addr}`);
    processor.addTransaction({ to: [addr], sighash });
  }

  public registerHandler(handler: BaseHandler) {
    console.log('Handler', `Registering ${handler.constructor.name}`);
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
      stateSchema: 'gear_processor',
    });

    processor.run(db, async (ctx) => {
      for (const handler of this._handlers) {
        try {
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

      for (const handler of this._handlers) {
        await handler.save();
      }
    });
  }
}

export async function runProcessor() {
  const processor = new VaraEthProcessor();

  for (const [name, Handler] of Object.entries(handlers)) {
    if (Handler.prototype instanceof BaseHandler) {
      const handler = new Handler();
      console.log(`[*] Initializing handler: ${name}`);
      await handler.init();
      console.log(`[*] Registering new handler: ${name}`);
      processor.registerHandler(handler);
    }
  }

  await processor.run();
}

if (require.main === module) {
  runProcessor().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
